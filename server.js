
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
  res.header('Content-Type', 'application/json');
  
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

// Mount API routes - ensure JSON content type
server.use('/api', (req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
}, router);

// Mount Netlify function routes
server.use('/.netlify/functions/server', (req, res, next) => {
  res.header('Content-Type', 'application/json');
  router(req, res, next);
});

// Serve frontend for all other routes (SPA support)
server.get('*', (req, res) => {
  // Skip API routes
  if (req.url.startsWith('/api') || req.url.startsWith('/.netlify/functions/server')) {
    return next();
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
  console.log(`Netlify functions API is available at http://localhost:${port}/.netlify/functions/server`);
});
