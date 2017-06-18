var registry = include('/services/config/registry.js');
var services = require('./config/services.json');

module.exports = function (chat) {
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
            if ((path !== undefined) || (key[0] === "hourly")) {
                registry[id].services[key[0]] = key[1];
                return "Service " + key[0] + " has been installed with value <" + key[1] + ">";
            }
            else return "Service not found";
        }
        else if (key.length === 1) {
            var path = services[key];
            if ((path !== undefined) || (key[0] === "hourly")) {
                registry[id].services[key] = true;
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
        if ((path !== undefined) && (key !== "service-manager") && (key !== "settings")) {
            delete registry[id].services[key];
            return "Service " + key + " has been removed";
        }
    }
    return "Service not found or cannot be removed"
}

function list(id, msg) {
    return "Services installed on this channel are: " + JSON.stringify(registry[id].services);
}