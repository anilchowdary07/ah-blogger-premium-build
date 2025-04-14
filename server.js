
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './dist', // Serve the frontend build files
  noCors: false
});
const port = process.env.PORT || 3000;

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
const fs = require('fs');
if (!fs.existsSync('./db.json')) {
  fs.writeFileSync('./db.json', JSON.stringify({ posts: [] }));
  console.log('Created initial db.json file');
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

// Explicitly set Content-Type header for all API responses
server.use((req, res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/.netlify/functions/server')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  next();
});

// Set explicit routes for API endpoints
server.use('/api', router);

// Mount Netlify function routes
server.use('/.netlify/functions/server', (req, res, next) => {
  // Always set content type for API responses
  res.header('Content-Type', 'application/json; charset=utf-8');
  
  // Process API requests directly
  if (req.url.startsWith('/posts') || req.url === '/') {
    router(req, res, next);
  } else {
    next();
  }
});

// Serve frontend for other routes (SPA support)
server.get('*', (req, res) => {
  // Skip already processed routes
  if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/.netlify/functions/server')) {
    return;
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
  console.log(`Netlify functions API is available at http://localhost:${port}/.netlify/functions/server`);
});
