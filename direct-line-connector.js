var https = require('https');

var DirectLineConnector = {
  conversationId: (process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID),
  watermark: '0',
  conversation: function () {
    var options = {
      host: 'directline.botframework.com',
      path: '/api/conversations',
      method: 'POST',
      headers:
      {
        'Authorization': 'BotConnector ' + (process.env.BOT_FRAMEWORK_DIRECT_API_PASSWORD),
      }
    };
    var post = https.request(options, function (res) { })
    post.end();
  },
  send: function (user, text) {
    var payload = JSON.stringify({
      "conversationId": this.conversationId,
      "from": user,
      "text": text
    });
    var options = {
      host: 'directline.botframework.com',
      path: '/api/conversations/' + this.conversationId + '/messages',
      method: 'POST',
      headers:
      {
        'Authorization': 'BotConnector ' + (process.env.BOT_FRAMEWORK_DIRECT_API_PASSWORD),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    var post = https.request(options, function (res) {
      console.log(res);
    })
    post.write(payload);
    post.end();
  },
  get: function (user) {
    https.get({
      hostname: 'directline.botframework.com',
      path: '/api/conversations/' + this.conversationId + '/messages',
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