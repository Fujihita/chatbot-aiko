var registry = include('/services/config/registry.js');

module.exports = function (chat) {
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/sets? mode/i.test(chat.text))
            return setMode(chat.id, chat.text);
        else return null
    }
}

function setMode(id, msg) {
    var str = msg.split(/sets? mode/i)[1];
    if (str !== undefined) {
        str = str.trim();
        if (/\+voice/i.test(str))
            registry[id].services.settings.voice = true;
        if (/\-voice/i.test(str))
            registry[id].services.settings.voice = false;
        if (/\+en/i.test(str))
            registry[id].services.settings.en = true;
        if (/\-en/i.test(str))
            registry[id].services.settings.en = false;
        if (/\+jp/i.test(str))
            registry[id].services.settings.jp = true;
        if (/\-jp/i.test(str))
            registry[id].services.settings.jp = false;
    }
    return "The current settings are: " + JSON.stringify(registry[id].services.settings);
}