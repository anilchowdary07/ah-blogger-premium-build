
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './dist', // Serve the frontend build files
  noCors: false
});
const port = process.env.PORT || 3000;

// Enable CORS for all origins
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Initialize db.json if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./db.json')) {
  fs.writeFileSync('./db.json', JSON.stringify({ posts: [] }));
  console.log('Created initial db.json file');
}

// API routes
server.use('/api', middlewares);
server.use('/api', router);

// Serve frontend for all other routes (SPA support)
server.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
});
