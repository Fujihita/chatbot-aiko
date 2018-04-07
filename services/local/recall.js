var registry = include('/services/config/registry.js');

public = {}

public.subscribe = function(config){
    registry[config.id].services["recall"] = {};
}

public.unsubscribe = function(config){
    delete registry[config.id].services["recall"];
}

public.execute = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/recalls?/i.test(chat.text))
            return recall(chat.id, chat.text);
        else
            if (/remembers?/i.test(chat.text))
                return remember(chat.id, chat.text);
        return null
    }
}

// search both sides of the memory for answer
/*
remember god as fujihita -> recall: {god:fujihita}
recall (god) -> fujihita
recall (fujihita) -> god
recall (devil) -> undefined
*/

function recall(id, msg) {
    var key = msg.split(/recalls? /)[1];
    if (key != undefined) {
        key = key.trim();
        var res = registry[id].services.recall[key];
        console.log(res);
        if ((res !== null) && (res !== undefined))
            return res;
        else {
            res = swap(registry[id].services.recall)[key];
            if ((res !== null) && (res !== undefined))
                return res;
            else
                return "Ehehe, what does \"" + key + "\" mean again?";
        }
    }
}

function remember(id, msg) {
    var str = msg.split(/remembers? /)[1];
    if (/->/.test(str)) {
        var value = str.split(/->/)[1];
        value = value.trim();
        var key = str.split(/->/)[0];
        key = key.trim();
        registry[id].services.recall[key] = value;
        return "Okay, I have memorized \"" + key + "\" as \"" + value + "\"";
    }
    else return "I'm sorry, I didn't quite catch that";
}

// http://stackoverflow.com/questions/23013573/swap-key-with-value-json
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

module.exports = public