var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
app.use(bodyParser().json);
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
  app.use('/', express.static('./html', {maxAge: 60*60*1000}));
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
  });
  app.post('/comment', function (req, res) {
  	console.log("In POST comment route");
  	console.log(req.body);
  	res.status(200);
  	res.end();
  });