var registry = include('/services/config/registry.js');

public = {}

public.subscribe = function(config){
    registry[config.id].services["wiki-link"] = config.value;
}

public.unsubscribe = function(config){
    delete registry[config.id].services["wiki-link"];
}

public.execute = function (chat) {
    if (/\[\[.+\]\]/.test(chat.text)) {
        return link(chat.id, chat.text);
    }
    return null;
}

function link(id, msg) {
    msg = msg.match(/\[\[[^\[\]]+\]\]/g);
    var result = msg.map(function (x) {
        x = x.replace(/ /g, "_");
        return "<" + registry[id].services["wiki-link"] + x.substring(2,x.length-2) + ">";
    })
    if (result == undefined)
        return null;
    return result;
}

module.exports = public;