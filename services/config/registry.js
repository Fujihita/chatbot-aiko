registry = {
    index: {
        // ChannelID: conversationID
    }
};

/*load default wikichat channel
conversationId = (process.env.BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID)
var channel = {
    type: "wikichat",
    auth: {
        host: (process.env.CHAT_HOST),
        name: (process.env.WIKIA_BOT_NAME),
        password: (process.env.WIKIA_BOT_PASSWORD),
        key: "",
        serverId: (process.env.CHAT_SERVER_ID),
        wikiId: (process.env.CHAT_SERVER_ID),
        roomId: (process.env.CHAT_ROOM_ID)
    },
    services: {},
    socket: ""
};

registry[conversationId] = channel;
*/


/*
// Discord registry prototype

conversationId: {
    type: "discord",
    auth: {
        name: (process.env.DISCORD_BOT_NAME),
        token: (process.env.DISCORD_APP_TOKEN),
        channelID: ""
    },
    services: {
        ping: true,
        recall: {},
        roller: true
    },
    socket: ""
}

 "service-manager": true,
        "ping": true,
        "recall": {
        },
        "roller": true,
        "hourly": {
            src: "./kancolle-hourlies.json",
            timer: {}
        },
        "roleplay": {
            ship: "Inazuma",
            en: true,
            jp: false,
            voice: true
        },
        "air-power": true,
*/

module.exports = registry;