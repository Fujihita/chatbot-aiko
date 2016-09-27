var Native = require('./native-services.js');

var WikiaChatConnector =
  {
    logger: '',
    running: false,
    name: (process.env.BOT_NAME),
    socket: "",
    load: function () {
      socket = require('socket.io-client')((process.env.CHAT_HOST),
        {
          query: {
            name: this.name,
            key: (process.env.CHAT_KEY),
            serverId: (process.env.CHAT_SERVER_ID),
            wikiId: (process.env.CHAT_SERVER_ID),
            roomId: (process.env.CHAT_ROOM_ID)
          }
        });
      this.subscribe();
      this.running = true;
    },
    subscribe: function () {
      socket.on('connect', function (msg) { this.running = true; });
      socket.on('message', function (payload) { WikiaChatConnector.logger.parse(payload); });
      socket.on('disconnect', function (msg) { this.running = false; });
    },
    send: function (msg) {
      socket.send(JSON.stringify({
        attrs: {
          msgType: "chat",
          name: this.name,
          text: msg,
        }
      }));
      //console.log(msg);
    },
    disconnect: function () {
      this.running = false;
      socket.disconnect();
    }
  };

WikiaChatConnector.logger = {
  log: [],
  parse: function (payload) {
    try {
      data = JSON.parse(payload.data);
      chat = {
        event: payload.event,
        timeStamp: new Date(data.attrs.timeStamp).toUTCString(),
        name: data.attrs.name,
        text: data.attrs.text,
        avatar: data.attrs.avatarSrc.replace("down/28", "down/100"),
        conversationId : (process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID)
      };
      this.event(chat);
    }
    catch (err) {
    }
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
    }
  },

  on_message: function (chat) {
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text);
    this.add(chat);
    if (chat.name != this.name) {
      var res = Native.match(chat);
      if (res !== null)
      {
        WikiaChatConnector.send(res);
      };
    }
  },
  on_logout: function (chat) {
    chat.timeStamp = new Date().toUTCString(),
      chat.text = chat.name + ' has left the chat';
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text)
    this.add(chat);
  },
  on_join: function (chat) {
    chat.timeStamp = new Date().toUTCString();
    chat.text = chat.name + ' has joined the chat';
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text)
    this.add(chat);
  },
  add: function (chat) {
    this.log.push(chat);
    this.log = this.keepLastElements(this.log, 300);
  },
  keepLastElements: function (arr, n) {
    if (arr.length > n) arr.splice(0, arr.length - n);
    return arr;
  }
};

module.exports = WikiaChatConnector;
