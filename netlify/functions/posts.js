const { Client } = require('@notionhq/client');
const { v4: uuidv4 } = require('uuid');

// Validate environment variables
if (!process.env.NOTION_TOKEN) {
  console.error('NOTION_TOKEN environment variable is missing');
  throw new Error('NOTION_TOKEN environment variable is required');
}
if (!process.env.NOTION_DATABASE_ID) {
  console.error('NOTION_DATABASE_ID environment variable is missing');
  throw new Error('NOTION_DATABASE_ID environment variable is required');
}

// Initialize Notion client with error handling
let notion;
try {
  notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
} catch (error) {
  console.error('Failed to initialize Notion client:', error);
  throw error;
}

const databaseId = process.env.NOTION_DATABASE_ID;

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

const ipRequests = new Map();

// Helper function to check rate limit
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;
  
  // Clean up old entries
  for (const [key, timestamp] of ipRequests.entries()) {
    if (timestamp < windowStart) {
      ipRequests.delete(key);
    }
  }
  
  // Count requests in current window
  const requestCount = Array.from(ipRequests.values())
    .filter(timestamp => timestamp >= windowStart)
    .length;
    
  if (requestCount >= RATE_LIMIT.max) {
    return false;
  }
  
  ipRequests.set(ip, now);
  return true;
}

// Helper function to validate post data
function validatePostData(post) {
  const requiredFields = ['title', 'slug', 'content', 'excerpt', 'author', 'date', 'category'];
  const missingFields = requiredFields.filter(field => !post[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Validate slug format
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
  }
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD.');
  }
}

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', JSON.stringify(event, null, 2));
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Check rate limit
    const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'];
    if (!checkRateLimit(clientIp)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests' })
      };
    }

    // Only allow GET, POST, PUT, DELETE methods
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    switch (event.httpMethod) {
      case 'GET':
        console.log('Fetching posts from Notion database');
        try {
          const response = await notion.databases.query({
            database_id: databaseId,
          });
          
          console.log('Notion response:', JSON.stringify(response, null, 2));
          
          if (!response.results) {
            throw new Error('No results returned from Notion');
          }

          const posts = response.results.map(page => {
            try {
              return {
                id: page.id,
                title: page.properties.title.title[0]?.text?.content || '',
                slug: page.properties.slug.rich_text[0]?.text?.content || '',
                content: page.properties.content.rich_text[0]?.text?.content || '',
                excerpt: page.properties.excerpt.rich_text[0]?.text?.content || '',
                author: page.properties.author.rich_text[0]?.text?.content || '',
                date: page.properties.date.date?.start || new Date().toISOString().split('T')[0],
                category: page.properties.category.select?.name || 'uncategorized',
                tags: page.properties.tags.multi_select?.map(tag => tag.name) || [],
                readingTime: page.properties.readingTime.number || 5,
                featured: page.properties.featured.checkbox || false,
                published: page.properties.published.checkbox || false,
                publishedAt: page.properties.publishedAt.date?.start,
                updatedAt: page.properties.updatedAt.date?.start
              };
            } catch (error) {
              console.error('Error processing page:', error);
              return null;
            }
          }).filter(post => post !== null);

          console.log(`Successfully processed ${posts.length} posts`);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(posts)
          };
        } catch (error) {
          console.error('Error fetching from Notion:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
              error: 'Failed to fetch posts from Notion',
              message: error.message,
              details: error.stack
            })
          };
        }

      case 'POST':
        // Create new post
        const newPost = JSON.parse(event.body);
        validatePostData(newPost);
        
        const page = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: newPost.title,
                  },
                },
              ],
            },
            slug: {
              rich_text: [
                {
                  text: {
                    content: newPost.slug,
                  },
                },
              ],
            },
            content: {
              rich_text: [
                {
                  text: {
                    content: newPost.content,
                  },
                },
              ],
            },
            excerpt: {
              rich_text: [
                {
                  text: {
                    content: newPost.excerpt,
                  },
                },
              ],
            },
            author: {
              rich_text: [
                {
                  text: {
                    content: newPost.author,
                  },
                },
              ],
            },
            date: {
              date: {
                start: newPost.date,
              },
            },
            category: {
              select: {
                name: newPost.category,
              },
            },
            tags: {
              multi_select: newPost.tags.map(tag => ({ name: tag })),
            },
            readingTime: {
              number: newPost.readingTime,
            },
            featured: {
              checkbox: newPost.featured,
            },
            published: {
              checkbox: newPost.published,
            },
            publishedAt: {
              date: newPost.published ? { start: new Date().toISOString() } : null,
            },
            updatedAt: {
              date: {
                start: new Date().toISOString(),
              },
            },
          },
        });

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ id: page.id })
        };

      case 'PUT':
        // Update post
        const updatedPost = JSON.parse(event.body);
        validatePostData(updatedPost);
        
        if (!updatedPost.id) {
          throw new Error('Post ID is required for updates');
        }

        await notion.pages.update({
          page_id: updatedPost.id,
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: updatedPost.title,
                  },
                },
              ],
            },
            slug: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.slug,
                  },
                },
              ],
            },
            content: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.content,
                  },
                },
              ],
            },
            excerpt: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.excerpt,
                  },
                },
              ],
            },
            author: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.author,
                  },
                },
              ],
            },
            date: {
              date: {
                start: updatedPost.date,
              },
            },
            category: {
              select: {
                name: updatedPost.category,
              },
            },
            tags: {
              multi_select: updatedPost.tags.map(tag => ({ name: tag })),
            },
            readingTime: {
              number: updatedPost.readingTime,
            },
            featured: {
              checkbox: updatedPost.featured,
            },
            published: {
              checkbox: updatedPost.published,
            },
            publishedAt: {
              date: updatedPost.published ? { start: new Date().toISOString() } : null,
            },
            updatedAt: {
              date: {
                start: new Date().toISOString(),
              },
            },
          },
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      case 'DELETE':
        // Delete post
        const { id } = JSON.parse(event.body);
        if (!id) {
          throw new Error('Post ID is required for deletion');
        }

        await notion.pages.update({
          page_id: id,
          archived: true,
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
    }
  } catch (error) {
    console.error('Error in function handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 