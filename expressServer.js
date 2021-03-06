var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user, pass) {
	return ((user === 'cs360') && (pass === 'test'));
});
var app = express();
app.use(bodyParser.json());
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
  app.use('/', express.static('./html', {maxAge: 60}));
  app.get('/getcity', function (req, res) {
    console.log("In getcity route");
    var urlObj = url.parse(req.url, true, false);
		fs.readFile("cities.dat.txt", function(err,data) {
			if (err) throw err;
			var cities = data.toString().split("\n");
			var jsonresult = [];
			var myRex = new RegExp("^"+urlObj.query["q"]);
			for (var i = 0; i < cities.length; i++) {
				var result = cities[i].search(myRex);
				if(result != -1) {
					console.log(cities[i]);
					jsonresult.push({city:cities[i]});
				}
			}
			console.log(jsonresult);
			console.log(JSON.stringify(jsonresult));
			res.writeHead(200);
			res.end(JSON.stringify(jsonresult));
		});
  });
  app.get('/comment', function(req, res) {
  	console.log("In comment route");
  	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
	if(err) throw err;
		db.collection("comments", function(err, comments){
			if(err) throw err;
			comments.find(function(err, items){
			items.toArray(function(err, itemArr){
				console.log("Document Array: ");
				console.log(itemArr);
				res.writeHead(200);
				res.end(JSON.stringify(itemArr));
			});
		});
	});
});
  });
  app.post('/comment', auth, function (req, res) {
  	console.log("In POST comment route");
  	console.log(req.body);
  	console.log(req.body.Name);
    console.log(req.body.Comment);
    var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if(err) throw err;
		db.collection('comments').insert(req.body,function(err, records) {
		console.log("Record added as "+records[0]._id);
		});

	});
	res.writeHead(200);
	res.end("");
  });
