var Discord = require('discord.io');
var Native = require('./native-services.js');
var ChannelMap = require('./channel-map.js');
var DirectLineConnector = require('./direct-line-connector.js');

var DiscordConnector = {
    socket: "",

    load: function () {
        this.socket = new Discord.Client({
            token: (process.env.DISCORD_APP_TOKEN),
            autorun: true
        });
        this.subscribe();
    },

    subscribe: function () {
        this.socket.on('message', this.multiplex);
    },

    multiplex: function (user, userID, channelID, message) {
        var conversationId = ChannelMap.getConversation({ type: 'discord', id: channelID });
        if (conversationId === null) {
            DirectLineConnector.conversation({ type: 'discord', id: channelID });
        }
        else {
            if (user !== (process.env.DISCORD_BOT_NAME)) {
                var chat = {
                    timeStamp: new Date().toUTCString(),
                    name: user,
                    text: message,
                    'conversationId': conversationId
                };
                var res = Native.match(chat);
                if (res !== null) {
                    DiscordConnector.send(channelID, res);
                };
            }
        }
    },

    send: function (channelID, message) {
        this.socket.sendMessage({
            'to': channelID,
            'message': message
        });
    }
};

module.exports = DiscordConnector;