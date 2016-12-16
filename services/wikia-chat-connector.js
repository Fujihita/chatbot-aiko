var Native = require('./native-services.js');
var WikiaLogin = require('./wikia-login.js');

var WikiaChatConnector =
  {
    logger: '',
    running: false,
    name: (process.env.WIKIA_BOT_NAME),
    socket: "",
    login: function () {
      WikiaLogin.login(WikiaChatConnector.load);
    },
    load: function () {
      socket = require('socket.io-client')((process.env.CHAT_HOST),
        {
          query: {
            name: WikiaChatConnector.name,
            key: WikiaLogin.chatKey,
            serverId: (process.env.CHAT_SERVER_ID),
            wikiId: (process.env.CHAT_SERVER_ID),
            roomId: (process.env.CHAT_ROOM_ID)
          }
        });
      WikiaChatConnector.subscribe();
      WikiaChatConnector.running = true;
    },
    subscribe: function () {
      socket.on('connect', function () { WikiaChatConnector.running = true; });
      socket.on('message', function (payload) { WikiaChatConnector.logger.parse(payload); });
      socket.on('disconnect', function () { WikiaChatConnector.running = false; });
    },
    send: function (msg) {
      socket.send(JSON.stringify({
        attrs: {
          msgType: "chat",
          name: WikiaChatConnector.name,
          text: msg,
        }
      }));
    },
    disconnect: function () {
      WikiaChatConnector.running = false;
      socket.disconnect();
    }
  };

WikiaChatConnector.logger = {
  log: [],
  parse: function (payload) {
    try {
      var data = JSON.parse(payload.data);
      var chat = {
        event: payload.event,
        timeStamp: new Date(data.attrs.timeStamp).toUTCString(),
        name: data.attrs.name,
        text: data.attrs.text,
        avatar: data.attrs.avatarSrc.replace("down/28", "down/100"),
        conversationId: (process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID)
      };
      this.event(chat);
    }
    catch (err) { }
  },

  event: function (chat) {
    switch (chat.event) {
      case "chat:add": {
        this.on_message(chat);
        break;
      }
      case "part": {
        this.on_logout(chat);
        break;
      }
      case "join": {
        this.on_join(chat);
        break;
      }
      default: {
        break;
      }
    }
  },

  on_message: function (chat) {
    this.add(chat);
    if (chat.name !== this.name) {
      var res = Native.match(chat);
      if (res !== null) {
        if (res.constructor === Array)
          res.forEach(function (msg) { WikiaChatConnector.send(msg); });
        else
          WikiaChatConnector.send(res);
      };
    }
  },
  on_logout: function (chat) {
    chat.timeStamp = new Date().toUTCString(),
      chat.text = chat.name + ' has left the chat';
    this.add(chat);
  },
  on_join: function (chat) {
    chat.timeStamp = new Date().toUTCString();
    chat.text = chat.name + ' has joined the chat';
    this.add(chat);
  },
  add: function (chat) {
    this.log.push(chat);
    this.log = this.keepLastElements(this.log, 300);
  },
  keepLastElements: function (arr, n) {
    if (arr.length > n)
      arr.splice(0, arr.length - n);
    return arr;
  }
};


var sendHourly = function () {
  if (((new Date).getMinutes() === 0) && ((new Date).getSeconds() < 30)) {
    var responses = require('./kancolle/Hourlies.js');
    var res = getJapanCurrentTime() + '00. ' + responses[getJapanCurrentTime()];
    if (getJapanCurrentTime().toString().length < 2) {
      res = '0' + res;
    }
    WikiaChatConnector.send(res);
  }
}

function getJapanCurrentTime() {
  var localTime = new Date();
  var offsetUtc = localTime.getTimezoneOffset() * 60000;
  localTime = localTime.getTime();
  var UtcTime = localTime + offsetUtc;
  var finalTime = UtcTime + (9 * 3600000);
  finalTime = new Date(finalTime);
  return finalTime.getHours();
}

setInterval(sendHourly, 30000);

module.exports = WikiaChatConnector;
