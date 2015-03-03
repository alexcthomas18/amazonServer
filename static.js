var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";
http.createServer(function(req, res) {
    var urlObj url.parse(req.url, true, false);
    if(urlObj.pathname.indexOf("getcity") != -1) {
	console.log(urlObj);
	console.log
