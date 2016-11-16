var DirectLineConnector = require('./direct-line-connector.js');
var ChannelMap = require('./channel-map.js');
var Native = {};
Native.ShipVoice = require('./kancolle/ShipVoice.js');

Native.match = function (chat) {
  if (chat.text === "ping") {
    return "pong";
  }
  if (RegExp('^(\/me |_)pokes ' + (process.env.DISCORD_BOT_NAME) + '\.?_?$', 'i').test(chat.text)) {
    return this.poke(chat.conversationId);
  }
  if ((RegExp('^(@' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[?!]+', 'i')).test(chat.text)) {
    return "Yes?";
  }
  if (((RegExp('^(@' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
    || (RegExp('[ ,](@' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {

    if (/ ?(play|change)( a)?( new)? role/i.test(chat.text))
      return this.roleplayRandom(chat.conversationId);
    else if (/ ?show( your)? role/i.test(chat.text))
      return this.showRole(chat.conversationId);
    else if (/(^|\s)AS [1-6]-[1-6]/i.test(chat.text))
      return this.findAS(chat.text);
    else if (/say/.test(chat.text))
      return this.echo(chat.text);
    else if (/rolls?/i.test(chat.text))
      return this.dice(chat.text);
    else
      return this.OnDefault(chat);
  }
  return null;
};

Native.dice = function (msg) {
  if (/ \d*d\d+\b/i.test(msg)) {
    var xd = msg.match(/ \d*d/i)[0];
    xd = xd.substring(1, xd.length - 1);
    if (xd == 0) {
      xd = 1;
    }
    var dy = msg.match(/d\d+\b/i)[0];
    dy = dy.substring(1, dy.length);

    var rand = Math.floor(Math.random() * dy) + 1;
    var output = rand.toString();
    var total = rand;
    for (i = 1; i < xd; i++) {
      rand = Math.floor(Math.random() * dy) + 1;
      output += ' + ' + rand.toString();
      total += rand;
    }
    if (xd > 1)
      output += ' = ' + total.toString();

    return output;
  }
  else {
    return "There's no spoon...I mean valid dice";
  }
};

Native.echo = function (msg) {
  var str = msg.split(/says?/)[1];
  if (/"/.test(str)) {
    str = msg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    str = str.substring(1, str.length - 1);
    return str;
  }
  else {
    return "There's nothing I want to say";
  }
};

Native.findAS = function (msg) {
  var MapAS = require('./kancolle/MapAS.js');
  var map = msg.match(/(^|\s)AS [1-6]-[1-6]/i)[0];
  map = map.substring(map.length - 3)
  var res = MapAS[map];
  if (typeof(res) == 'undefined')
    res = "I don't think there was a map called " + map;
  return res;
}

Native.poke = function (conversationId) {
  var linesArr = this.ShipVoice[ChannelMap.getRole(conversationId)].lines;
  return linesArr[(Math.floor(Math.random() * linesArr.length) + 1) - 1];
};

Native.showRole = function (conversationId) {
  return "I am " + this.ShipVoice[ChannelMap.getRole(conversationId)].name;
};

Native.roleplayRandom = function (conversationId) {
  ChannelMap.setRole(conversationId, (Math.floor(Math.random() * this.ShipVoice.length) + 1) - 1);
  return "Guess who I am now!"
};

Native.OnDefault = function (chat) {
  var str = chat.text.replace(RegExp('[ ,](@' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i'), "");
  str = str.replace((RegExp('^(@' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')), "");
  str = str.replace(/^ +/, "");
  str = str.replace(/[, ]+$/, "");
  DirectLineConnector.send(chat.conversationId, chat.name, str);
  return null;
};

module.exports = Native;