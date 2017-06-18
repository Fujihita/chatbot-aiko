var registry = include('/services/config/registry.js');

function sendHourly() {
    try {
        if (((new Date).getMinutes() === 0) && ((new Date).getSeconds() < 30)) {
            for (var key in registry) {
                if (key != "index") {
                    var path = registry[key].services.hourly;
                    if ((registry.hasOwnProperty(key)) && (path != undefined)) {
                        var responses = require(path);
                        if (responses !== undefined) {
                            var res = getJapanCurrentTime() + '00. ' + responses[getJapanCurrentTime()];
                            if (getJapanCurrentTime().toString().length < 2) {
                                res = '0' + res;
                            }
                            registry[key].socket.send(res);
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        console.log(e);
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

module.exports = sendHourly;