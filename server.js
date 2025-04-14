
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './dist', // Serve the frontend build files
  noCors: false
});
const port = process.env.PORT || 3000;
const fs = require('fs');

// Enable CORS for all origins with proper headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Initialize db.json if it doesn't exist
if (!fs.existsSync('./db.json')) {
  // Create with initial posts to prevent empty database issues
  const initialPosts = [
    {
      "id": "1",
      "title": "The Future of Artificial Intelligence in Content Creation",
      "slug": "future-ai-content-creation",
      "excerpt": "Exploring how AI is revolutionizing content creation and what it means for writers and creators in the digital age.",
      "content": "Content about AI in content creation...",
      "coverImage": "https://images.unsplash.com/photo-1677442136019-21780ecad695",
      "author": "Dr. Sarah Chen",
      "date": "2024-04-05",
      "category": "technology",
      "tags": ["artificial intelligence", "content creation", "digital media"],
      "readingTime": 6,
      "featured": true,
      "published": true
    },
    {
      "id": "2",
      "title": "Quantum Computing: Breaking Down the Basics",
      "slug": "quantum-computing-basics",
      "excerpt": "A beginner-friendly exploration of quantum computing principles and why they matter for the future of technology.",
      "content": "Content about quantum computing...",
      "coverImage": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      "author": "Prof. Alan Moretti",
      "date": "2024-04-02",
      "category": "science",
      "tags": ["quantum computing", "technology", "physics"],
      "readingTime": 8,
      "featured": false,
      "published": true
    }
  ];
  fs.writeFileSync('./db.json', JSON.stringify({ posts: initialPosts }));
  console.log('Created initial db.json file with sample posts');
}

// Use middleware before mounting the router
server.use(middlewares);

// Parse JSON request bodies
server.use(jsonServer.bodyParser);

// Log all requests to help with debugging
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Set Content-Type for API responses
server.use((req, res, next) => {
  // Only set JSON content type for API endpoints
  if (req.url.startsWith('/api') || req.url === '/posts' || req.url.startsWith('/posts/') || req.url.startsWith('/.netlify/functions/server')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  next();
});

// Handle query parameters for categories
server.get('/posts', (req, res, next) => {
  let posts = router.db.get('posts').value();
  
  // Filter by category if provided
  if (req.query.category) {
    posts = posts.filter(post => post.category === req.query.category);
  }
  
  // Filter by featured if provided
  if (req.query.featured !== undefined) {
    const isFeatured = req.query.featured === 'true';
    posts = posts.filter(post => post.featured === isFeatured);
  }
  
  // Filter by slug if provided
  if (req.query.slug) {
    posts = posts.filter(post => post.slug === req.query.slug);
  }
  
  return res.json(posts);
});

// Error handling middleware
server.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: true,
    message: 'Internal Server Error',
    details: err.message
  });
});

// Set explicit routes for API endpoints
server.use('/api', router);

// Direct access to posts
server.use('/posts', router);

// Mount Netlify function routes
server.use('/.netlify/functions/server', (req, res, next) => {
  try {
    // Process API requests directly
    if (req.url.startsWith('/posts') || req.url === '/') {
      res.header('Content-Type', 'application/json; charset=utf-8');
      router(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    console.error('Netlify function error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
});

// Serve frontend for other routes (SPA support)
server.get('*', (req, res) => {
  // Skip already processed routes
  if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/posts' || req.originalUrl.startsWith('/posts/') || req.originalUrl.startsWith('/.netlify/functions/server')) {
    return;
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Add error handling for server startup
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
  console.log(`Direct posts endpoint is available at http://localhost:${port}/posts`);
  console.log(`Netlify functions API is available at http://localhost:${port}/.netlify/functions/server`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
