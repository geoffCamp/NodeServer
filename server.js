const http = require('http'),
      express = require('express');
      path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

/*
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log("Server running at http://"+hostname+":"+port+"/");
});
*/

var app = express();
app.set('port', process.env.PORT || port);
app.get('/', function(req, res) {
    res.send('<html><body><h1>HelloWorld</h1></body></html>');
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
