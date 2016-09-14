const http = require('http'),
      express = require('express');
      path = require('path');

MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var mongoHost = 'localHost';
var mongoPort = '27017';
var collectionDriver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.connect("mongodb://localhost:27017/MyDatabase", function(err, db) {
    if (err) {
        console.error("Error exiting ... must start mongo first");
        process.exit(1);
    }
    colelctionDriver = new CollectionDriver(db);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.send('<html><body><h1>HelloWorld</h1></body></html>');
});

app.use(function (req, res) {
    res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
