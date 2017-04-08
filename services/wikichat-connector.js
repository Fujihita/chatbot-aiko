var parser = require('./wikichat-parser');
var services = require('./service-loader');
var DirectLineConnector = require('./web/direct-line-connector');

module.exports = function (conversationId, channel) {
    return {
        id: conversationId,
        socket: require('socket.io-client')(channel.auth.host,
            {
                query: {
                    name: (process.env.WIKIA_BOT_NAME),
                    key: channel.auth.key,
                    serverId: channel.auth.serverId,
                    wikiId: channel.auth.wikiId,
                    roomId: channel.auth.roomId
                }
            }),
        subscribe: function () {
            var self = this;
            this.socket.on('connect', function (msg) { /* set running var here */ });
            this.socket.on('message', function (payload) {
                payload.id = self.id;
                var chat = parser.parse(payload);
                var res = services(chat);
                if ((res !== null) && (res !== undefined)) {
                    if (res.constructor === Array)
                        res.forEach(function (msg) { self.send(msg); });
                    else
                        self.send(res);
                }
                else if ((chat !== null) && (chat !== undefined)) {
                    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
                        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
                        var str = chat.text.replace(RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i'), "");
                        str = str.replace((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')), "");
                        str = str.replace(/^ +/, "");
                        str = str.replace(/[, ]+$/, "");
                        DirectLineConnector.send(chat.id, chat.name, str);
                        return null;
                    }
                }
            });
            this.socket.on('disconnect', function (msg) { /* set running var here */ });
        },
        disconnect: function () {
            this.socket.disconnect();
        },
        send: function (msg) {
            this.socket.send(JSON.stringify({
                attrs: {
                    msgType: "chat",
                    name: process.env.WIKIA_BOT_NAME,
                    text: msg,
                }
            }));
        },
    };
}

/*
socket = require('WikichatConnector')(channel);
socket.subscribe();
socket.send(msg);
socket.disconnect();
*/