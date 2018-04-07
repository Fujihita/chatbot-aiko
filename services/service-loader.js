var services = require('./config/services.json');
var registry = include('/services/config/registry.js');

module.exports = function (chat) {
    if ((chat === null) || (chat === undefined))
        return null;
    var res = null;

    for (var key in registry[chat.id].services) {
        if ((registry[chat.id].services[key] !== false) && (res == null)) {
            var path = services[key];
            if (path !== undefined) {
                var module = include(path);
                try {
                    var temp = module.execute(chat);
                }
                catch (e) {
                    console.log(e);
                }
                if ((temp !== undefined) && (temp !== null))
                    res = temp;
            }
        }
    }
    return res;
}