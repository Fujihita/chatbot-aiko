var DirectLineConnector = require('./direct-line-connector.js');
var ChannelMap = require('./channel-map.js');
var Native = {};
Native.ShipVoice = require('./kancolle/ShipVoice.js');

Native.dice = function (msg) {
  if (/ \d*d\d+\b/i.test(msg)) {
    var xd = msg.match(/ \d*d/i)[0];
    xd = xd.substring(1, xd.length - 1);
    if (xd == 0) {
      xd = 1;
    }
    dy = msg.match(/d\d+\b/i)[0];
    dy = dy.substring(1, dy.length);
    var rand = Math.floor(Math.random() * xd * dy) + 1;
    return rand.toString();
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

Native.poke = function (conversationId)
{
  var linesArr = this.ShipVoice[ChannelMap.getRole(conversationId)].lines;
    return linesArr[(Math.floor(Math.random() * linesArr.length) + 1)-1];
};

Native.showRole = function (conversationId)
{
    return "I am " + this.ShipVoice[ChannelMap.getRole(conversationId)].name;
};

Native.roleplayRandom = function(conversationId)
{
    ChannelMap.setRole(conversationId, (Math.floor(Math.random() * this.ShipVoice.length) + 1)-1);
    return "Guess who I am now!"
};

Native.match = function (chat) {
  if (chat.text == "ping") {
    return "pong";
  }
  if ((chat.text == "\/me pokes Aiko")|| (chat.text == "_pokes Aiko_")) {
    return this.poke(chat.conversationId);
  }
   if (chat.text == "Aiko, play a new role") {
    return this.roleplayRandom(chat.conversationId);
  }
   if (chat.text == "Aiko, show your role") {
    return this.showRole(chat.conversationId);
  }
  if (/Aiko[?!]+/i.test(chat.text)) {
    return "Yes?";
  }
  if ((/^Aiko[ ,]/i.test(chat.text)) || (/[ ,]Aiko\??$/i.test(chat.text))) {
    if (/say/.test(chat.text)) {
      return this.echo(chat.text);
    }
    else if (/rolls?/i.test(chat.text)) {
      return this.dice(chat.text);
    }
    else {
      return this.OnDefault(chat);
    }
  }
  return null;
};

Native.OnDefault = function (chat) {
  var str = chat.text.replace(/[, ]+@?Aiko$/, "");
  str = str.replace(/^@?Aiko[, ]+/, "")
  DirectLineConnector.send(chat.conversationId, chat.name, str);
  return null;
};

module.exports = Native;