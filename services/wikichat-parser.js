var logger = require('./wikichat-logger');

var WikichatParser = {}

WikichatParser.parse = function (payload) {
    try {
        data = JSON.parse(payload.data);
        chat = {
            event: payload.event,
            timeStamp: new Date(data.attrs.timeStamp).toUTCString(),
            name: data.attrs.name,
            text: data.attrs.text,
            avatar: data.attrs.avatarSrc.replace("down/28", "down/100"),
            id: payload.id
        };
        return attachLogger(chat);
    }
    catch (err) {
        console.log(data);
        console.log(err);
        return null;
    }
}

function attachLogger (chat) {
    switch (chat.event) {
        case "chat:add": {
            return on_message(chat);
            break;
        }
        case "part": {
            return on_logout(chat);
            break;
        }
        case "join": {
            return on_join(chat);
            break;
        }
    }
}

function on_message (chat) {
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text);
    logger.add(chat);
    return chat;
}
function on_logout (chat) {
    chat.timeStamp = new Date().toUTCString();
    chat.text = chat.name + ' has left the chat';
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text);
    logger.add(chat);
    return null;
}
function on_join (chat) {
    chat.timeStamp = new Date().toUTCString();
    chat.text = chat.name + ' has joined the chat';
    console.log('[' + chat.event + '] <' + chat.name + '> ' + chat.text);
    return null;
}

module.exports = WikichatParser;