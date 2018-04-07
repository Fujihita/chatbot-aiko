var registry = include('/services/config/registry.js');
public = {}

public.subscribe = function (config) {
    registry[config.id].services["rpg"] = {
        encounter: [],
        equipment: [],
        monster: [],
        pain: [],
        reward: [],
    };
    new_game(config.id);
}

public.unsubscribe = function (config) {
    delete registry[config.id].services["rpg"];
}

public.execute = function (chat) {
    var decks = registry[chat.id].services["rpg"];
    if (((RegExp('^(' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[ ,:]', 'i')).test(chat.text))
        || (RegExp('[ ,](' + (process.env.DISCORD_BOT_NAME) + '|<@' + process.env.DISCORD_BOT_ID + '>)[\?]?$', 'i').test(chat.text))) {
        if (/ ?draw encounter/i.test(chat.text))
            return draw(chat.id, decks.encounter);
        else if (/ ?draw equipment/i.test(chat.text))
            return draw(chat.id, decks.equipment);
        else if (/ ?draw monster/i.test(chat.text))
            return draw(chat.id, decks.monster);
        else if (/ ?draw pain/i.test(chat.text))
            return draw(chat.id, decks.pain);
        else if (/ ?draw reward/i.test(chat.text))
            return draw(chat.id, decks.reward);
        else if (/ ?start( a)? new game?/i.test(chat.text))
            return new_game(chat.id);
        else return null
    }
}

function draw(id, deck) {
    if (deck.length < 1)
        return "This deck is out of card!";
    if (registry[id].services["help"] === "embed")
        return read_card(deck.pop());
    else
        return read_plain_card(deck.pop());
};

function read_card(card) {
    return {
        "embed": {
            "title": `${card.name.toUpperCase()}`,
            "description": `${card.description}`,
            "color": 15370000,
            "thumbnail": {
                "url": "https://d2ujflorbtfzji.cloudfront.net/preview/006071fc.c17ceea7-8f46-4620-9feb-484820bccdac.png"
            },
            "fields": [
                {
                    "name": "Effect",
                    "value": `${card.effect}`
                }
            ]
        }
    };
}

function read_plain_card(card) {
    return `
    =============================\n
    ${card.name.toUpperCase()}\n
    ${card.description}\n
    =============================\n
    Effect: ${card.effect}`;
}

function new_game(id) {
    var decks = JSON.parse(JSON.stringify(require('./decks.json')));
    registry[id].services["rpg"].encounter = shuffle(decks.encounter);
    registry[id].services["rpg"].equipment = shuffle(decks.equipment);
    registry[id].services["rpg"].monster = shuffle(decks.monster);
    registry[id].services["rpg"].pain = shuffle(decks.pain);
    registry[id].services["rpg"].reward = shuffle(decks.reward);
    return ["All decks have been shuffled."];
}

// https://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize
function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

module.exports = public;