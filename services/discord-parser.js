var logger = require('./wikichat-logger');

var DiscordParser = {};

DiscordParser.parse = function (user, userID, channelID, message) {
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
                        'conversationId': conversationId,
                        'channelID':channelID
                    };
                
                }
            }
        }

module.exports = DiscordParser;