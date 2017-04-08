var https = require('https');
var WikiaLogin = {};
<<<<<<< HEAD
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
=======

WikiaLogin.cookie = '';

WikiaLogin.chatKey = '';

WikiaLogin.login = function (handler) {
    var options = {
      host: 'kancolle.wikia.com',
      path: '/api.php?action=login&format=json&lgname='+ encodeURIComponent(process.env.WIKIA_BOT_NAME) +'&lgpassword='+ encodeURIComponent(process.env.WIKIA_BOT_PASSWORD),
      method: 'POST',
    };
    var post = https.request(options, function (res) {
      var body = '';
      var cookie = res.headers['set-cookie'];
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        WikiaLogin.loginToken(cookie, JSON.parse(body).login.token, handler);
      }.bind({handler:this.handler}));
    }.bind({handler:handler}));
    post.end();
}

WikiaLogin.loginToken = function (cookie, token, handler) {
    var options = {
      host: 'kancolle.wikia.com',
      path: '/api.php?action=login&format=json&lgname='+ encodeURIComponent(process.env.WIKIA_BOT_NAME) +'&lgpassword='+ encodeURIComponent(process.env.WIKIA_BOT_PASSWORD) + '&lgtoken=' + token,
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
        cookie[2] = cookie[2].replace('wikicitiesToken','OAID');
        var new_cookie = cookie[3].substring(0, 36) + cookie[2].substring(0,38) + cookie[4].substring(0,27) + cookie[5].substring(0, 80) + JSON.parse(body).login.cookieprefix + '_session=' + JSON.parse(body).login.sessionid;
        WikiaLogin.cookie = new_cookie;
        WikiaLogin.getChatKey(new_cookie, handler);
      }.bind({handler:this.handler}));
   }.bind({handler:handler}));
    post.end();
>>>>>>> 3b61c693067f8666b4ff6bf1417ec34c7be73582
}

//http://kancolle.wikia.com/wikia.php?controller=Chat&format=json

<<<<<<< HEAD
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
=======
WikiaLogin.getChatKey = function(cookie, handler) {
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
        WikiaLogin.chatKey = JSON.parse(body).chatkey;
        this.handler(JSON.parse(body).chatkey);
      }.bind({handler:this.handler}));
   }.bind({handler:handler}));
}

module.exports = WikiaLogin;
>>>>>>> 3b61c693067f8666b4ff6bf1417ec34c7be73582
