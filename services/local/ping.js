var registry = include('/services/config/registry.js');

public = {}

public.subscribe = function(config){
    registry[config.id].services["ping"] = true;
}

public.unsubscribe = function(config){
    delete registry[config.id].services["ping"];
}

public.execute = function (chat) {
    if (chat.text == "ping") {
        return "pong";
    }
    return null;
}

module.exports = public;