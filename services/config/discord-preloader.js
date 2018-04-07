var registry = include('/services/config/registry.js');
var services = include('/services/config/services.json');

module.exports = function (conversationID, channelID) {
  registry.index[channelID] = conversationID;
  registry[conversationID] = {
    type: "discord",
    auth: {
      name: (process.env.DISCORD_BOT_NAME),
      token: (process.env.DISCORD_APP_TOKEN),
      "channelID": channelID
    },
    services: {
    },
    socket: ""
  };

  include(services["service-manager"]).subscribe({ "id": conversationID });
  include(services["ping"]).subscribe({ "id": conversationID });
  include(services["recall"]).subscribe({ "id": conversationID });
  include(services["roller"]).subscribe({ "id": conversationID });
  include(services["rpg"]).subscribe({ "id": conversationID });
  include(services["help"]).subscribe({ "id": conversationID, "value": "embed" });
}