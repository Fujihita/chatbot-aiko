global.base_dir = __dirname;
global.abs_path = function (path) {
  return base_dir + path;
}
global.include = function (file) {
  return require(abs_path('/' + file));
}

var express = require('express');
var app = express();
var https = require('https');
var server = require('http').createServer(app);

var preloader = include('/services/config/wiki-preloader.js');
preloader(process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID);

var router = require('./router.js');

app.use('/', router);
server.listen(process.env.PORT || 1337);
