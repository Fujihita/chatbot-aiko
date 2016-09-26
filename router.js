var express = require('express');
var router = express.Router();
var WikiaChatConnector = require('./wikia-chat-connector.js');
var BotCore = require('./aiko-botcore.js');

router.use('/scripts', express.static(__dirname + '/scripts'));
router.use('/resources', express.static(__dirname + '/resources'));
router.use('/partials', express.static(__dirname + '/views/partials'));

router.get('/', function (req, res) {
  res.sendfile('views/log.html', { root: __dirname });
});
router.get('/log', function (req, res) {
  res.json(WikiaChatConnector.logger.log);
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
  if (WikiaChatConnector.running == true) {
    res.send('Aiko is working!');
  }
  else {
    res.send('Aiko is sleeping...');
  }
});

function startWikiaChatConnector() {
  try {
    WikiaChatConnector.load();
  }
  catch (e) {
    console.log(e);
  }
}

function stopWikiaChatConnector() {
  try {
    WikiaChatConnector.send("I'm off now...");
    WikiaChatConnector.disconnect();
  }
  catch (e) {
    console.log(e);
  }
}

startWikiaChatConnector();

module.exports = router;