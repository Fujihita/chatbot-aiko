var Native = require('./native-services.js');

var WikiaChatConnector =
  {
    logger: '',
    running: false,
    name: (process.env.WIKIA_BOT_NAME),
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
      socket.on('connect', function () { this.running = true; });
      socket.on('message', function (payload) { WikiaChatConnector.logger.parse(payload); });
      socket.on('disconnect', function () { this.running = false; });
    },
    send: function (msg) {
      socket.send(JSON.stringify({
        attrs: {
          msgType: "chat",
          name: this.name,
          text: msg,
        }
      }));
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
  if ((new Date).getMinutes() === 0) {
    var responses = [
      'Vice Admiral Kurita and the Center Force has arrived in Palawan', // 0
      'Yamato\'s radar detected an unknown vessel, possibly a hostile submarine',
      'Oh, I have to remind you that new PvP opponents will arrive soon...',
      'PvP reset. Aww...I didn\'t get any of you my queue?', // 3
      'Atago is sinking. Everyone, the day will reset in one hour',
      'My daily reset alarm! The clock is rewinding to 1941!',
      'T minus 48 minutes to airstrike. I should get off the Arizona now...', // 6
      'Welp, we\'re back to square one, let\'s try changing history today too',
      'The first wave is over, the time is changing again...', // 8
      'Hiryuu is launching a counterattack!', // UTC == 0000, JST == 0900
      'We got one of their carriers. Is Akagi still on fire?',
      'Second wave of attack won\'t make it--Ah, farewell Yamaguchi Tamon...',
      'It\'s so dark here. Where are we now?', // 12
      'Akatsuki is flooding. Why Akatsuki? Can\'t you leave it to Hiei?',
      'Yukikaze and Teruzuki has returned without Hiei...Get ready for naval exercises. We must be strong!',
      'The new PvP teams have arrived. Go, go, go!', // 15
      'Yamato has left the base. Eh, Yukikaze is with her. This won\'t end well...',
      'Expedition fleet has returned. Inazuma and Ikazuchi picked up 800 gaijins from the sortie',
      'What terrible visions I have. The war truly never ends for some of us', // 18
      'Curry for dinner and some quick daily constructions',
      'T minus 48 minutes to the first--Eh? Hawaiian time? 10 more hours it is then...',
      'Reporting in for night missions!', // 21
      'The Tassafaronga cargo ships are unloading. Air defense duty, now!',
      'Kongo, Haruna will arrive at destination in 33 minutes, type 3 loaded for bombardment.'
    ];
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

setInterval(sendHourly, 45000);

module.exports = WikiaChatConnector;
