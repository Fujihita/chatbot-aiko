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
<<<<<<< HEAD:services/web/direct-line-connector.js
    var post = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        
      })
=======
    var post = https.request(options, function () {
     
>>>>>>> 3b61c693067f8666b4ff6bf1417ec34c7be73582:services/direct-line-connector.js
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