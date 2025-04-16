const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Handle all routes
server.use('/.netlify/functions/server', router);

exports.handler = async (event, context) => {
  try {
    const { path, httpMethod, body, queryStringParameters } = event;
    
    // Create a mock request object
    const req = {
      method: httpMethod,
      path: path.replace('/.netlify/functions/server', ''),
      body: body ? JSON.parse(body) : {},
      query: queryStringParameters || {}
    };

    // Create a mock response object
    const res = {
      status: (code) => ({
        json: (data) => ({
          statusCode: code,
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        })
      })
    };

    // Handle the request
    return await new Promise((resolve) => {
      server(req, res, () => {
        resolve(res.status(404).json({ error: 'Not Found' }));
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }
}; 