var https = require('https');
var WikiaLogin = {};
var registry = require('./config/registry');

WikiaLogin.login = function (conversationId) {
  var name = registry[conversationId].auth.name;
  var password = registry[conversationId].auth.password;
  var options = {
    host: 'kancolle.wikia.com',
    path: '/api.php?action=login&format=json&lgname=' + encodeURIComponent(name) + '&lgpassword=' + encodeURIComponent(password),
    method: 'POST',
  };
  var post = https.request(options, function (res) {
    var body = '';
    var cookie = res.headers['set-cookie'];
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      loginToken(cookie, JSON.parse(body).login.token, conversationId);
    });
  });
  post.end();
}

function loginToken (cookie, token, conversationId) {
  var name = registry[conversationId].auth.name;
  var password = registry[conversationId].auth.password;
  var options = {
    host: 'kancolle.wikia.com',
    path: '/api.php?action=login&format=json&lgname=' + encodeURIComponent(name) + '&lgpassword=' + encodeURIComponent(password) + '&lgtoken=' + token,
    method: 'POST',
    headers:
    {
      'Cookie': cookie
    }
  };
  var post = https.request(options, function (res) {
    var body = '';
    var cookie = res.headers['set-cookie'];
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      cookie[2] = cookie[2].replace('wikicitiesToken', 'OAID');
      var new_cookie = cookie[3].substring(0, 36) + cookie[2].substring(0, 38) + cookie[4].substring(0, 27) + cookie[5].substring(0, 80) + JSON.parse(body).login.cookieprefix + '_session=' + JSON.parse(body).login.sessionid;
      getChatKey(new_cookie, conversationId);
    });
  });
  post.end();
}

//http://kancolle.wikia.com/wikia.php?controller=Chat&format=json

function getChatKey (cookie, conversationId) {
  https.get({
    host: 'kancolle.wikia.com',
    path: '/wikia.php?controller=Chat&format=json',
    method: 'GET',
    headers:
    {
      'cookie': cookie
    }
  }, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      console.log(JSON.parse(body).username);
      console.log(JSON.parse(body).chatkey);
      var chatkey = JSON.parse(body).chatkey;
        registry[conversationId].auth.key = chatkey; // final handler writes back chatkey to registry.js
    });
  });
}

module.exports = WikiaLogin.login;