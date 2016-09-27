var DirectLineConnector = require('./direct-line-connector.js');

var Native = {};

Native.ShipVoice = require('./resources/kancolle/ShipVoice.js');

Native.roleId = 21;
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

Native.OnDefault = function (name, msg) {
  var str = msg.replace(/[, ]+@?Aiko$/, "");
  str = str.replace(/^@?Aiko[, ]+/, "")
  DirectLineConnector.send(chat.name, str);
  return null;
};

Native.poke = function ()
{
  var linesArr = this.ShipVoice[this.roleId].lines;
    return linesArr[(Math.floor(Math.random() * linesArr.length) + 1)-1];
};

Native.showRole = function ()
{
    return "I am " + this.ShipVoice[this.roleId].name;
};

Native.roleplayRandom = function()
{
    Native.roleId = (Math.floor(Math.random() * this.ShipVoice.length) + 1)-1;
    return "Guess who I am now!"
};

Native.match = function (chat) {
  if (chat.text == "ping") {
    return "pong";
  }
  if (chat.text == "\/me pokes Aiko") {
    return this.poke();
  }
   if (chat.text == "Aiko, play a new role") {
    return this.roleplayRandom();
  }
   if (chat.text == "Aiko, show your role") {
    return this.showRole();
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
    // pass message to Bot Framework API
    else {
      return this.OnDefault(chat.name, chat.text);
    }
  }
};

module.exports = Native;