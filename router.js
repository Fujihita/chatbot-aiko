var express = require('express');
var router = express.Router();
var http = require('http');
var WikiaChatConnector = require('./services/wikichat-connector.js');
var WikiaChatLog = require('./services/wikichat-logger.js');
var DiscordSocket = require('./services/discord-connector.js')();
var BotCore = require('./services/web/aiko-botcore.js');
var registry = require('./services/config/registry');

var running = false;

router.use('/scripts', express.static(__dirname + '/scripts'));
router.use('/resources', express.static(__dirname + '/resources'));
router.use('/partials', express.static(__dirname + '/views/partials'));

router.get('/', function (req, res) {
  res.sendfile('views/log.html', { root: __dirname });
});
router.get('/log', function (req, res) {
  res.json(WikiaChatLog.log);
});

router.get('/registry', function (req, res) {
  var payload = {};
  for (var key in registry) {
    if (key != "index") {
      if (registry.hasOwnProperty(key)) {
        payload[key] = {};
        payload[key].type = registry[key].type;
        if (registry[key].type == 'wikichat')
          payload[key].host = registry[key].auth.host;
        else if (registry[key].type == 'discord')
          payload[key].channelID = registry[key].auth.channelID;
        payload[key].services = registry[key].services;
      }
    }
  }
  res.json(payload);
});

router.get('/furniture', function (req, res) {
  res.sendfile('views/Grabber.html', { root: __dirname });
});
router.get('/poi', function (req, res) {
  res.sendfile('views/export-nodeinfo.html', { root: __dirname });
});

router.get('/api/stop', function (req, res) {
  stopChatConnector();
  res.send('Sending Aiko to bed...');
});

router.get('/api/start', function (req, res) {
  startChatConnector();
  res.send('Waking Aiko up...');
});

router.post('/api/messages', BotCore.connector.listen());

router.get('/api/status', function (req, res) {
  if (running == true) {
    res.send('Aiko is working!');
  }
  else {
    res.send('Aiko is sleeping...');
  }
});

function startChatConnector() {
  try {
    for (var key in registry) {
      if (key != "index") {
        if ((registry.hasOwnProperty(key)) && (registry[key].type == 'wikichat')) {
          var socket = WikiaChatConnector(key, registry[key]);
          socket.subscribe();
          registry[key].socket = socket;
        }
      }
    }
    DiscordSocket.connect();
    running = true;
  }
  catch (e) {
    console.log(e);
  }
}

function stopChatConnector() {
  try {
    for (var key in registry) {
      if (key != "index") {
        if ((registry.hasOwnProperty(key)) && (registry[key].type == 'wikichat')) {
          var socket = registry[key].socket;
          socket.send("I'm off now...");
          socket.disconnect();
        }
        else if (registry[key].type == 'discord') {
          var socket = registry[key].socket;
          //socket.send("I'm off now...");
        }
      }
    }
    if (running != false)
      DiscordSocket.disconnect();
    running = false;
  }
  catch (e) {
    console.log(e);
  }
}

DiscordSocket.subscribe();

require('./services/refresh-chat-key')(startChatConnector);
setInterval(function () { require('./services/refresh-chat-key')(startChatConnector); }, 60 * 60 * 1000);

module.exports = router;