var registry = include('/services/config/registry.js');
var services = require('./config/services.json');

public = {}

public.subscribe = function (config) {
    registry[config.id].services["service-manager"] = true;
}

public.unsubscribe = function (config) {

}

public.execute = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/Adds? Service /i.test(chat.text))
            return subscribe(chat.id, chat.text);
        else if (/Removes? Service /i.test(chat.text))
            return unsubscribe(chat.id, chat.text);
        else if (/Lists? Service/i.test(chat.text))
            return list(chat.id, chat.text);
        else return null
    }
}

function subscribe(id, msg) {
    var key = msg.split(/Adds? Service /i)[1];
    if (key !== undefined) {
        key = key.split(" ");
        if (key.length === 2) {
            var path = services[key[0]];
            if (path !== undefined) {
                getService(key[0]).subscribe({ "id": id, "value": key[1] });
                return "Service " + key[0] + " has been installed with value <" + key[1] + ">";
            }
            else return "Service not found or value is invalid";
        }
        else if (key.length === 1) {
            var path = services[key];
            if (path !== undefined) {
                getService(key).subscribe({ "id": id });
                return "Service " + key + " has been installed";
            }
            else return "Service not found";
        }
    }
    else return null;
}

function unsubscribe(id, msg) {
    var key = msg.split(/Removes? Service /i)[1];
    if (key !== undefined) {
        key = key.trim();
        var path = services[key];
        if (path !== undefined) {
            getService(key).unsubscribe({ "id": id });
            return "Service " + key + " has been removed";
        }
    }
    return "Service not found or cannot be removed"
}

function list(id, msg) {
    filtered_record = registry[id].services;
    if (filtered_record["twitter-feed"] != undefined) {
        filtered_record["twitter-feed"].timer = undefined;
        filtered_record["twitter-feed"].content = undefined;
    }
    if (filtered_record["hourly"] != undefined)
        filtered_record["hourly"].timer = undefined;

    if (filtered_record["rpg"] != undefined)
        filtered_record["rpg"] = true;
    return "Services installed on this channel are: " + JSON.stringify(filtered_record);
}

function getService(key) {
    var path = services[key];
    return include(path);
}

module.exports = public;