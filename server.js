const http = require('http'),
      express = require('express');
      bodyParser = require('body-parser');
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
    collectionDriver = new CollectionDriver(db);
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:collection', function(req,res) {
    var params = req.params;
    collectionDriver.findAll(req.params.collection, function(error,objs) {
        if (error) {
            res.send(400, error);
        } else {
            if (req.accepts('html')) { //this is specified in the header by the browser
                res.render('data', {objects: objs, collection: req.params.collection});
            } else {
                res.set('Content-Type','application/json');
                res.send(200,objs); 
            }
        }
    });
});

app.get('/:collection/:entity', function(req, res) {
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
        collectionDriver.get(collection, entity, function(error, objs) {
            if (error) {
                res.send(400, objs);
            } else {
                res.send(200, objs);
            }
        });
    } else {
        res.send(400, {error: 'bar url', url: req.url});
    }
});

/*
app.get('/', function(req, res) {
    res.send('<html><body><h1>HelloWorld</h1></body></html>');
});
*/

app.post('/:collection', function(req, res) {
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
        if (err) {
            res.send(400, err);
        } else {
            res.send(201, docs);
        }
    });
});

app.use(function (req, res) {
    res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
