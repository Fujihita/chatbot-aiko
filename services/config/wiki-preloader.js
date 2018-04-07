var registry = include('/services/config/registry.js');
var services = include('/services/config/services.json');

module.exports = function (conversationId) {
    registry[conversationId] = {
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
        services: {
        },
        socket: ""
    };

    include(services["service-manager"]).subscribe({ "id": conversationId });
    include(services["ping"]).subscribe({ "id": conversationId });
    include(services["recall"]).subscribe({ "id": conversationId });
    include(services["roller"]).subscribe({ "id": conversationId });
    include(services["hourly"]).subscribe({ "id": conversationId, "value": "./kancolle-hourlies.json" });
    include(services["roleplay"]).subscribe({ "id": conversationId, "value": "Inazuma" });
    include(services["air-power"]).subscribe({ "id": conversationId });
    include(services["help"]).subscribe({ "id": conversationId });
    include(services["twitter-feed"]).subscribe({ "id": conversationId, "value": "KanColle_STAFF"});
}