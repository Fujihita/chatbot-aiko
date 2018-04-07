var registry = include('/services/config/registry.js');

hourly = {};

hourly.subscribe = function (config) {
    if (registry[config.id].services["hourly"] != undefined)
        clearInterval(registry[config.id].services["hourly"].timer);
    timer = setTimer(config.id);
    registry[config.id].services["hourly"] = {
        src: config.value,
        timer: setInterval(timer, 30000)
    }
}

hourly.unsubscribe = function (config) {
    clearInterval(registry[config.id].services.hourly.timer);
    delete registry[config.id].services.hourly;
}

hourly.execute = function (chat) {
    return null;
}

function setTimer(id) {
    return function () {
        try {
            if (((new Date).getMinutes() === 0) && ((new Date).getSeconds() < 30)) {
                var path = registry[id].services.hourly.src;
                if (path != undefined) {
                    var responses = require(path);
                    if (responses !== undefined) {
                        var res = getJapanCurrentTime() + '00. ' + responses[getJapanCurrentTime()];
                        if (getJapanCurrentTime().toString().length < 2) {
                            res = '0' + res;
                        }
                        registry[id].socket.send(res);
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

function getJapanCurrentTime() {
    var localTime = new Date();
    var offsetUtc = localTime.getTimezoneOffset() * 60000;
    localTime = localTime.getTime();
    var UtcTime = localTime + offsetUtc;
    var finalTime = UtcTime + (9 * 3600000);
    finalTime = new Date(finalTime);
    return finalTime.getHours();
}

module.exports = hourly;