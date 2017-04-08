module.exports = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/(^|\s)AS [1-6]-[1-6]/i.test(chat.text))
            return findAS(chat.text);
        else return null
    }
}

function findAS(msg) {
    var MapAS = require('./kancolle-map-as.json');
    var map = msg.match(/(^|\s)AS [1-6]-[1-6]/i)[0];
    map = map.substring(map.length - 3)
    var res = MapAS[map];
    if (typeof (res) == 'undefined')
        res = "I don't think there was a map called " + map;
    return JSON.parse(res);
}