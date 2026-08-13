const http = require('http');

const server = http.createServer((request, response) => {
    console.log(`${request.method} ${request.url}`);
 
    if (request.url === '/') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('Support server. Available routes: /health, /api/info');
        return;
        }

  // /health   → ?
    if (request.url === '/health') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('Health check passed');
        return;
    } 
  // /api/info → ?
    if (request.url === '/api/info') {  
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('API information');
        return;
    }
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Not found');
});


server.listen(3001, () => {
  console.log('Server listening on http://localhost:3001');
});