var registry = include('/services/config/registry.js');

public = {}

public.subscribe = function(config){
    registry[config.id].services["air-power"] = true;
}

public.unsubscribe = function(config){
    delete registry[config.id].services["air-power"];
}

public.execute = function (chat) {
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

module.exports = public;