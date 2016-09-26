var DirectLineConnector = require('./direct-line-connector.js');

var Native = {};

Native.match = function (chat) {
  if (chat.text == "ping") {
    return "pong";
  }
  if (/Aiko[?!]+/i.test(chat.text)) {
    return "Yes?";
  }
  // echo function
  if ((/^Aiko[ ,]/i.test(chat.text)) || (/[ ,]Aiko\??$/i.test(chat.text))) {
    if (/say/.test(chat.text)) {

      var str = chat.text.split(/says?/)[1];
      if (/"/.test(str)) {
        str = chat.text.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
        str = str.substring(1, str.length - 1);
        return str;
      }
      else {
        return "There's nothing I want to say";
      }
    }
    // dice roll function
    else if (/rolls?/i.test(chat.text)) {
      if (/ \d*d\d+\b/i.test(chat.text)) {
        var xd = chat.text.match(/ \d*d/i)[0];
        xd = xd.substring(1, xd.length - 1);
        if (xd == 0) {
          xd = 1;
        }
        dy = chat.text.match(/d\d+\b/i)[0];
        dy = dy.substring(1, dy.length);
        var rand = Math.floor(Math.random() * xd * dy) + 1;
        return rand.toString();
      }
      else {
        return "There's no spoon...I mean valid dice";
      }
    }
    // pass message to Bot Framework API
    else {
      var str = chat.text.replace(/[, ]+@?Aiko$/, "");
      str = str.replace(/^@?Aiko[, ]+/, "")
      DirectLineConnector.send(chat.name, str);
      return null;
    }
  }
};

module.exports = Native;