var https = require('https');
var TextAnalytics = {};

TextAnalytics.sentiment = function(text, handler) {
  var payload = JSON.stringify({
    "documents": [
      {
        "language": "en",
        "id": "1",
        "text": text
      }]
  });
  var options = {
    host: 'westus.api.cognitive.microsoft.com',
    path: '/text/analytics/v2.0/sentiment',
    method: 'POST',
    headers:
    {
      'Ocp-Apim-Subscription-Key': (process.env.TEXT_ANALYTICS_API_KEY),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };
  var post = https.request(options, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {handler((JSON.parse(body).documents[0].score)); });
  })
  post.write(payload);
  post.end();
}

module.exports = TextAnalytics;