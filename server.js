global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

var express = require('express');
var app = express();
var https = require('https');
var server = require('http').createServer(app);
var router = require('./router.js');

app.use('/', router);
server.listen(process.env.PORT || 1337);

function heartBeat() {
  https.get({
    hostname: 'telemetryapp.azurewebsites.net',
    path: '/',
  }, (res) => { });
}
setInterval(heartBeat, 60000);

//"{\"documents\":[{\"score\":0.5467136,\"id\":\"1\"}],\"errors\":[]}"