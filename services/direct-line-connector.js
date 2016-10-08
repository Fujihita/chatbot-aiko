var https = require('https');
var Channel = require('./channel-map.js');

var DirectLineConnector = {
  watermark: '0',
  conversation: function (channel) {
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
        Channel.add(this.channel,JSON.parse(body).conversationId);
      }.bind({ channel: this.channel }));
    }.bind({ channel: channel }));
    post.end();
  },
  send: function (conversationId, user, text) {
    var payload = JSON.stringify({
      "conversationId": conversationId,
      "from": user,
      "text": text
    });
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
    var post = https.request(options, function () {
     
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
      res.on('end', function () { });
    });
  }
};

module.exports = DirectLineConnector;