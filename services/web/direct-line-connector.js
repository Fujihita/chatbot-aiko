var https = require('https');
var registry = include('/services/config/registry.js');

var DirectLineConnector = {
  watermark: '0',
  startConversation: function (channelID) {
    var options = {
      host: 'directline.botframework.com',
      path: '/api/conversations',
      method: 'POST',
      headers:
      {
        'Authorization': 'BotConnector ' + (process.env.BOT_FRAMEWORK_DIRECT_API_PASSWORD),
      }
    };
    var post = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        var id = JSON.parse(body).conversationId;
        registry.index[this.channelID] = id;

        registry[id] = {
          type: "discord",
          auth: {
            name: (process.env.DISCORD_BOT_NAME),
            token: (process.env.DISCORD_APP_TOKEN),
            "channelID": this.channelID
          },
          services: {
            "service-manager": true,
            "settings": {
              "en": true, "jp": false, "voice": true
            },
            ping: true,
            recall: {},
            roller: true
          },
          socket: ""
        }
      }.bind({ channelID: this.channelID }));
    }.bind({ channelID: channelID }));
    post.end();
  },
  send: function (conversationId, user, text) {
    var payload = JSON.stringify({
      "conversationId": conversationId,
      "from": user,
      "text": text
    });
    console.log(payload);
    var options = {
      host: 'directline.botframework.com',
      path: '/api/conversations/' + conversationId + '/messages',
      method: 'POST',
      headers:
      {
        'Authorization': 'BotConnector ' + (process.env.BOT_FRAMEWORK_DIRECT_API_PASSWORD),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    var post = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {

      })
    })
    post.write(payload);
    post.end();
  },
  get: function (conversation) {
    https.get({
      hostname: 'directline.botframework.com',
      path: '/api/conversations/' + conversation + '/messages',
      headers: {
        'authorization': 'BotConnector ' + (process.env.BOT_FRAMEWORK_DIRECT_API_PASSWORD),
        'watermark': this.watermark,
        agent: false
      }
    }, (res) => {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () { console.log(body); });
    });
  }
};

module.exports = DirectLineConnector;