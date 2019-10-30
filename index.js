var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/app/index.html');
});

app.use(express.static('app'));

http.listen(3001, function() {
	console.log('listening on localhost:3001');
});