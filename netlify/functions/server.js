
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'blog.db');

// Initialize SQLite database
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    db.serialize(() => {
      // Create posts table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT,
          coverImage TEXT,
          author TEXT,
          date TEXT,
          category TEXT,
          tags TEXT,
          readingTime INTEGER,
          featured INTEGER DEFAULT 0,
          published INTEGER DEFAULT 1,
          publishedAt TEXT,
          updatedAt TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating posts table:', err);
          reject(err);
          return;
        }
        
        // Check if table is empty and seed with initial data if needed
        db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
          if (err) {
            console.error('Error checking posts count:', err);
            reject(err);
            return;
          }
          
          if (row.count === 0) {
            console.log('Seeding initial blog posts...');
            const initialPosts = require('./initialPosts.json');
            
            const stmt = db.prepare(`
              INSERT INTO posts (
                id, title, slug, excerpt, content, coverImage, 
                author, date, category, tags, readingTime, 
                featured, published, publishedAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            initialPosts.forEach(post => {
              stmt.run(
                post.id,
                post.title,
                post.slug,
                post.excerpt,
                post.content,
                post.coverImage || null,
                post.author,
                post.date,
                post.category,
                JSON.stringify(post.tags),
                post.readingTime,
                post.featured ? 1 : 0,
                post.published ? 1 : 0,
                post.publishedAt || null,
                post.updatedAt || null
              );
            });
            
            stmt.finalize();
          }
          
          db.close();
          resolve();
        });
      });
    });
  });
};

// Create custom router for SQLite
const createSqliteRouter = () => {
  return {
    // Get all posts or filter by query params
    async getPosts(req, res) {
      const db = new sqlite3.Database(dbPath);
      let query = 'SELECT * FROM posts';
      let params = [];
      
      // Handle query params (category, featured, slug)
      if (req.query) {
        const conditions = [];
        
        if (req.query.category) {
          conditions.push('category = ?');
          params.push(req.query.category);
        }
        
        if (req.query.featured) {
          conditions.push('featured = ?');
          params.push(req.query.featured === 'true' ? 1 : 0);
        }
        
        if (req.query.slug) {
          conditions.push('slug = ?');
          params.push(req.query.slug);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      db.all(query, params, (err, rows) => {
        db.close();
        
        if (err) {
          console.error('Error fetching posts:', err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        
        // Convert row format to match API
        const posts = rows.map(row => ({
          ...row,
          tags: JSON.parse(row.tags),
          featured: row.featured === 1,
          published: row.published === 1
        }));
        
        res.json(posts);
      });
    },
    
    // Get a single post by ID
    async getPostById(req, res) {
      const id = req.params.id;
      const db = new sqlite3.Database(dbPath);
      
      db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
        db.close();
        
        if (err) {
          console.error(`Error fetching post ${id}:`, err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        
        if (!row) {
          res.status(404).json({ error: 'Post not found' });
          return;
        }
        
        // Convert row format to match API
        const post = {
          ...row,
          tags: JSON.parse(row.tags),
          featured: row.featured === 1,
          published: row.published === 1
        };
        
        res.json(post);
      });
    },
    
    // Create a new post
    async createPost(req, res) {
      const post = req.body;
      const db = new sqlite3.Database(dbPath);
      
      // Generate ID if not provided
      if (!post.id) {
        post.id = Math.random().toString(36).substring(2, 9);
      }
      
      const stmt = db.prepare(`
        INSERT INTO posts (
          id, title, slug, excerpt, content, coverImage, 
          author, date, category, tags, readingTime, 
          featured, published, publishedAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        post.id,
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.coverImage || null,
        post.author,
        post.date,
        post.category,
        JSON.stringify(post.tags),
        post.readingTime,
        post.featured ? 1 : 0,
        post.published ? 1 : 0,
        post.publishedAt || new Date().toISOString(),
        new Date().toISOString(),
        function(err) {
          stmt.finalize();
          db.close();
          
          if (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ error: 'Database error' });
            return;
          }
          
          // Return the created post
          res.status(201).json({
            ...post,
            id: post.id
          });
        }
      );
    },
    
    // Update a post
    async updatePost(req, res) {
      const id = req.params.id;
      const updates = req.body;
      const db = new sqlite3.Database(dbPath);
      
      // Check if post exists
      db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
        if (err) {
          db.close();
          console.error(`Error checking post ${id}:`, err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        
        if (!row) {
          db.close();
          res.status(404).json({ error: 'Post not found' });
          return;
        }
        
        // Build the update query
        const fields = [];
        const values = [];
        
        Object.entries(updates).forEach(([key, value]) => {
          // Skip id since it's the primary key
          if (key === 'id') return;
          
          fields.push(`${key} = ?`);
          
          if (key === 'tags') {
            values.push(JSON.stringify(value));
          } else if (key === 'featured' || key === 'published') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        });
        
        // Always update the updatedAt field
        fields.push('updatedAt = ?');
        values.push(new Date().toISOString());
        
        // Add the id to values array (for the WHERE clause)
        values.push(id);
        
        const query = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`;
        
        db.run(query, values, function(err) {
          if (err) {
            db.close();
            console.error(`Error updating post ${id}:`, err);
            res.status(500).json({ error: 'Database error' });
            return;
          }
          
          // Get the updated post
          db.get('SELECT * FROM posts WHERE id = ?', [id], (err, updatedRow) => {
            db.close();
            
            if (err) {
              console.error(`Error fetching updated post ${id}:`, err);
              res.status(500).json({ error: 'Database error' });
              return;
            }
            
            // Convert row format to match API
            const updatedPost = {
              ...updatedRow,
              tags: JSON.parse(updatedRow.tags),
              featured: updatedRow.featured === 1,
              published: updatedRow.published === 1
            };
            
            res.json(updatedPost);
          });
        });
      });
    },
    
    // Delete a post
    async deletePost(req, res) {
      const id = req.params.id;
      const db = new sqlite3.Database(dbPath);
      
      db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
        db.close();
        
        if (err) {
          console.error(`Error deleting post ${id}:`, err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        
        if (this.changes === 0) {
          res.status(404).json({ error: 'Post not found' });
          return;
        }
        
        res.json({ success: true });
      });
    }
  };
};

// Initialize middlewares
const middlewares = jsonServer.defaults();

// Enable CORS for all origins
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Log all requests
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Initialize database and routes
let sqliteRouter;

// API routes
server.get('/posts', async (req, res) => {
  sqliteRouter.getPosts(req, res);
});

server.get('/posts/:id', async (req, res) => {
  sqliteRouter.getPostById(req, res);
});

server.post('/posts', async (req, res) => {
  sqliteRouter.createPost(req, res);
});

server.patch('/posts/:id', async (req, res) => {
  sqliteRouter.updatePost(req, res);
});

server.delete('/posts/:id', async (req, res) => {
  sqliteRouter.deletePost(req, res);
});

exports.handler = async (event, context) => {
  // Initialize database if needed
  await initDatabase();
  
  // Create router
  sqliteRouter = createSqliteRouter();
  
  // Strip off the /api prefix from the path
  const path = event.path.replace(/^\/\.netlify\/functions\/server/, '');
  
  return new Promise((resolve, reject) => {
    const mockRequest = {
      method: event.httpMethod,
      headers: event.headers,
      url: path || '/',
      body: event.body ? JSON.parse(event.body) : null,
      query: event.queryStringParameters || {}
    };
    
    const mockResponse = {
      statusCode: 200,
      headers: {},
      body: '',
      
      status(status) {
        this.statusCode = status;
        return this;
      },
      
      json(data) {
        this.headers['Content-Type'] = 'application/json';
        this.body = JSON.stringify(data);
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body
        });
      },
      
      setHeader(key, value) {
        this.headers[key] = value;
        return this;
      },
      
      end(data) {
        this.body = data || '';
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body
        });
      }
    };
    
    server(mockRequest, mockResponse);
  });
};
