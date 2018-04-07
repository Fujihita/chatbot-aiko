var registry = include('/services/config/registry.js');
var https = require('https');

public = {}

public.subscribe = function (config) {
    if (registry[config.id].services["twitter-feed"] != undefined)
        clearInterval(registry[config.id].services["twitter-feed"].timer);
    var timer = setTimer(config.id, config.value);
    registry[config.id].services["twitter-feed"] = {
        "username": config.value,
        "timer": setInterval(timer, 30000),
        "tweet": 0,
        "content": ""
    }
}

public.unsubscribe = function (config) {
    clearInterval(registry[config.id].services["twitter-feed"].timer);
    delete registry[config.id].services["twitter-feed"];
}

public.execute = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/shows? tweet/i.test(chat.text)) {
            if (registry[chat.id].type != "discord")
                return [
                    "==Latest tweet @" + registry[chat.id].services["twitter-feed"].username + "==\nhttps://twitter.com/" + registry[chat.id].services["twitter-feed"].username + "/status/" + registry[chat.id].services["twitter-feed"].tweet,
                    registry[chat.id].services["twitter-feed"].content
                ];
            else return "Last tweet from " + registry[chat.id].services["twitter-feed"].username + "\nhttps://twitter.com/" + registry[chat.id].services["twitter-feed"].username + "/status/" + registry[chat.id].services["twitter-feed"].tweet
        }
        else return null;
    }
}

function setTimer(id, username) {
    return function () {
        https.get({
            host: 'twitter.com',
            path: '/' + username,
        }, function (res) {
            var body = '';
            res.on('data', function (chunk) { body += chunk; });
            res.on('end', function () {
                var content = body.split("data-aria-label-part=\"0\"", 2);
                content = content[1].split("<a href=", 2)[0];
                content.substring(1, content.length - 1);
                var tweet = (/data-tweet-id=\"[0-9]+/.exec(body)[0].substring(15));

                if ((registry[id].services["twitter-feed"].tweet != tweet) && (registry[id].services["twitter-feed"].tweet != 0)) {
                    var res = "Tweet @" + registry[id].services["twitter-feed"].username + ": https://twitter.com/" + registry[id].services["twitter-feed"].username + "/status/" + tweet;
                    if (registry[id].type != "discord") {
                        registry[id].socket.send(res);
                        registry[id].socket.send(content);
                    }
                    else
                        registry[id].socket.send(res);

                }
                registry[id].services["twitter-feed"].tweet = tweet;
                registry[id].services["twitter-feed"].content = content;
            });
        });
    }
}

module.exports = public;