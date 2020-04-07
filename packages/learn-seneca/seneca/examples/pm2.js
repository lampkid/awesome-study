var http = require('http');

var server = http.createServer( (request, response) => {
    console.log('called!');
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World\n");
});

const port = 9001;
server.listen(port);
console.log(`server running at http://127.0.0.1:${port}`);
