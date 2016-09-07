var cfg = require('./config.json');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client/build')));

// start the app
app.listen(cfg.port, function() {
  console.log('Server started: http://localhost:' +cfg.port + '/');
});
