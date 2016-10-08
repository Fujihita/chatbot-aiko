var channels = {
    list: [{
        'channel': {
            type: 'wikiachat',
            key: (process.env.CHAT_KEY),
            serverId: (process.env.CHAT_SERVER_ID),
            wikiId: (process.env.CHAT_SERVER_ID),
            roomId: (process.env.CHAT_ROOM_ID)
        },
        'conversation': (process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID),
        'role': 21
    }],
    getConversation: function (channel) {
        var i = null;
        this.list.forEach(function (item) {
            if (JSON.stringify(item.channel) === JSON.stringify(channel)) {
                i = item.conversation;
            }
        });
        return i;
    },

    get: function (conversationId) {
        var i = null;
        this.list.forEach(function (item) {
            if (JSON.stringify(item.conversation) === conversationId) {
                i = item.channel;
            }
        });
        return i;
    },
    getRole: function (conversationId) {
        var role = 21;
        this.list.forEach(function (item) {
            if (item.conversation === conversationId) {
                role = item.role;
            }
        });
        return role;
    },
    setRole: function (conversationId, role) {
        this.list.forEach(function (item) {
            if (item.conversation === conversationId) {
                item.role = role;
            }
        });
    },
    add: function (channel, conversation) {
        this.list.push({
            'channel': channel,
            'conversation': conversation,
            'role': 21
        });
    }
}

module.exports = channels;