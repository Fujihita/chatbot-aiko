var WikiaLogin = require('./wikia-login');
var registry = require('./config/registry');

function refreshChatKey() {
    for (var key in registry) {
        if (key != "index") {
            if ((registry.hasOwnProperty(key)) && (registry[key].type = 'wikichat')) {
                WikiaLogin(key);
            }
        }
    }
}

module.exports = refreshChatKey;
