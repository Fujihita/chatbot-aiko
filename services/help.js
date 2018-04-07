var registry = include('/services/config/registry.js');
var package = include('/package.json');

public = {}

public.subscribe = function (config) {
    if (config.value == undefined)
        config.value = "text";
    if ((config.value != "text") && (config.value != "embed"))
        config.value = "text";
    registry[config.id].services["help"] = config.value;
}

public.unsubscribe = function (config) {
    delete registry[config.id].services["help"];
}

public.execute = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if ((/help$/i.test(chat.text)) || (/^help/i.test(chat.text)))
            return this.help(chat.id);
        else
            if (/help /i.test(chat.text))
                return getTopic(chat.id, chat.text);
        return null
    }
}

public.help = function (id) {
    if (registry[id].services["help"] === "embed")
        return embed_help;
    else
        return plain_help;
}

function getTopic(id, msg) {
    var key = msg.split(/help /)[1];
    if (key != undefined) {
        key = key.trim();
        var res = all_topics[key];
        console.log(res);
        if ((res !== null) && (res !== undefined))
            return res[registry[id].services["help"]];
        else
            return "Only God can help you on that";
    }
}

var embed_help = {
    "embed": {
        "title": "Chatbot Aiko - Help",
        "description": "Github documentation is not up to date, please refer to built-in help commands for all latest features",
        "color": 15370000,
        "timestamp": package.last_update,
        "footer": {
            "text": `version ${package.version}`
        },
        "thumbnail": {
            "url": "https://cdn.discordapp.com/app-icons/230218757472124928/799c9f5303a521f73891e9c754238c95.png"
        },
        "author": {
            "name": "Fujihita",
            "url": "https://github.com/Fujihita/chatbot-aiko",
            "icon_url": "https://cdn.discordapp.com/avatars/159635999410880512/03101ec9f087dfd1df6de2334809c976.png"
        },
        "fields": [
            {
                "name": "PREFIX/SUFFIX: AIKO",
                "value": "Append \"Aiko\" (case-insensitive) to the start or the end of a message to address Aiko.\nFor example: \"Aiko, roll d20\", \"roll d20 aiko\""
            },
            {
                "name": "SERVICES",
                "value": "Send \"Aiko, list services\" to see all services available on this channel\nSend \"Aiko, add service <service> <value>\" to add a new <service> with <value> as parameter. Not all services will require a parameter.\nSend \"Aiko, remove service <service>\" to remove an existing <service> from the channel\nSend \"Aiko, help services\" and \"Aiko, help <service>\" for more information"
            },
            {
                "name": "LATEST UPDATE",
                "value": "Send \"Aiko, help update\" to see the latest patch note"
            }
        ]
    }
};

var plain_help = [
    `Chatbot Aiko - Help (version: ${package.version}, created ${package.last_update})`,
    embed_help.embed.description,
    `==${embed_help.embed.fields[0].name}==\n${embed_help.embed.fields[0].value}`,
    `==${embed_help.embed.fields[1].name}==\n${embed_help.embed.fields[1].value}`,
    `==${embed_help.embed.fields[2].name}==\n${embed_help.embed.fields[2].value}`,
    "Github: https://github.com/Fujihita/chatbot-aiko"
];

var services = require('./config/services.json');

var all_topics = {
    "services": {
        "embed": object2Arr(services),
        "text": object2Arr(services)
    }
}

function object2Arr(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(key);
    }
    return arr;
}

module.exports = public;