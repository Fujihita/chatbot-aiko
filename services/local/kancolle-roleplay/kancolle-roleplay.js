var registry = include('/services/config/registry.js');
var ship_voice = require('./kancolle-ship-voice.json');

module.exports = function (chat) {
    var role = registry[chat.id].services.roleplay;
    if (RegExp('^(\/me |_)pokes ' + (process.env.DISCORD_BOT_NAME) + '\.?_?$', 'i').test(chat.text)) {
        return poke(chat.id, role);
    }
    else
        if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
            || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
            if (/ ?show( your)? role/i.test(chat.text))
                return "I am " + role;
            else if (/ ?(play|change)( a)?( new)? role/i.test(chat.text))
                return newRole(chat.id);
            else return null
        }
}

function poke(id, role) {
    var lines = ship_voice[role].lines;
    var rand_id = randomProperty(lines);
    var res = [];
    if (registry[id].services.settings.jp)
        res.push(lines[rand_id].jp);
    if (registry[id].services.settings.en)
        res.push(lines[rand_id].en);
    if (registry[id].services.settings.voice)
        res.push(getFilePath(ship_voice[role].api_id, ship_voice[role].api_filename, rand_id));
    return res;
};

function newRole(id) {
    registry[id].services.roleplay = randomProperty(ship_voice);
    return "Guess who I am now!"
};

// http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
function randomProperty(obj) {
    var keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0];
};

function getFilePath(api_id, api_filename, line_id) {
    keys = [2475, 6547, 1471, 8691, 7847, 3595, 1767, 3311, 2507, 9651, 5321, 4473, 7117, 5947, 9489, 2669, 8741, 6149, 1301, 7297, 2975, 6413, 8391, 9705, 2243, 2091, 4231, 3107, 9499, 4205, 6013, 3393, 6401, 6985, 3683, 9447, 3287, 5181, 7587, 9353, 2135, 4947, 5405, 5223, 9457, 5767, 9265, 8191, 3927, 3061, 2805, 3273, 7331]
    var filename = 100000 + 17 * (api_id + 7) * keys[line_id - 1] % 99173
    return 'http://203.104.209.71/kcs/sound/kc' + api_filename + '/' + filename + '.mp3';
}