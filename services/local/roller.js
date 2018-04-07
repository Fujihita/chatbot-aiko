var registry = include('/services/config/registry.js');

public = {};

public.subscribe = function(config){
    registry[config.id].services["roller"] = true;
}

public.unsubscribe = function(config){
    delete registry[config.id].services["roller"];
}

public.execute = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/rolls?/i.test(chat.text))
            return dice(chat.text);
        else return null
    }
}

function dice(msg) {
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

module.exports = public;