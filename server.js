var express = require('express');
var app = express();
var https = require('https');
var server = require('http').createServer(app);
var router = require('./router.js');

app.use('/', router);
server.listen(process.env.PORT || 1337);

function heartBeat() {
  https.get({
    hostname: ' ',
    path: '/',
  }, (res) => { });
}
// setInterval(heartBeat, 600000);