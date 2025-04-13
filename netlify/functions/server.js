
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, 'db.json');

// Initialize db.json if it doesn't exist
if (!fs.existsSync(dbPath)) {
  // Ensure the directory exists
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify({ posts: [] }));
}

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Enable CORS for all origins
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

server.use(router);

exports.handler = async (event, context) => {
  // Strip off the /api prefix from the path
  const path = event.path.replace(/^\/\.netlify\/functions\/server/, '');
  
  return new Promise((resolve, reject) => {
    const mockRequest = {
      method: event.httpMethod,
      headers: event.headers,
      url: path || '/',
      body: event.body
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
