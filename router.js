var express = require('express');
var router = express.Router();
var http = require('http');
var WikiaChatConnector = require('./services/wikichat-connector.js');
var WikiaChatLog = require('./services/wikichat-logger.js');
var DiscordConnector = require('./services/discord-connector.js');
var BotCore = require('./services/web/aiko-botcore.js');
var registry = require('./services/config/registry');

var DiscordSocket = {};

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
router.get('/furniture', function (req, res) {
  res.sendfile('views/Grabber.html', { root: __dirname });
});
router.get('/poi', function (req, res) {
  res.sendfile('views/Poidb2NodeInfo.html', { root: __dirname });
});

router.get('/api/stop', function (req, res) {
  stopWikiaChatConnector();
  res.send('Sending Aiko to bed...');
});

router.get('/api/start', function (req, res) {
  startWikiaChatConnector();
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

function startWikiaChatConnector() {
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
    DiscordSocket = DiscordConnector();
    DiscordSocket.subscribe();
    running = true;
  }
  catch (e) {
    console.log(e);
  }
}

function stopWikiaChatConnector() {
  try {
    for (var key in registry) {
      if (key != "index") {
        if ((registry.hasOwnProperty(key)) && (registry[key].type == 'wikichat')) {
          var socket = registry[key].socket;
          socket.send("I'm off now...");
          socket.disconnect();
        }
        else if (registry[key].type == 'discord') {
          socket.send("I'm off now...");
        }
      }
    }
    DiscordSocket.disconnect();
    running = false;
  }
  catch (e) {
    console.log(e);
  }
}

require('./services/refresh-chat-key')();
setTimeout(startWikiaChatConnector, 5000); // delay 5s for chatkeys acquisition
setInterval(require('./services/refresh-chat-key'), 60 * 60 * 1000);
setInterval(startWikiaChatConnector, 60 * 60 * 1000);

setInterval(require('./services/local/hourly/hourly'), 30000);

module.exports = router;