var should = require('should/as-function');
var ping = require("../services/local/ping");
var loader = require("../services/service-loader");
var recall = require("../services/local/recall");
var roller = require("../services/local/roller");

describe('unit test service loader', function () {
    it('should bring up ping service', function () {
        var chat = {
            text: "ping"
        };
        should(loader(chat)).be.exactly("pong");
    });
    it('should discard null request', function () {
        var chat = {

        };
        should(loader(chat)).be.exactly(null);
    });
});
describe('unit test ping service', function () {

    it('should produce valid ping response', function () {
        var chat = {
            text: "ping"
        };
        should(ping(chat)).be.exactly("pong");
    });
    it('should produce invalid ping response', function () {
        var chat = {
            text: "test"
        };
        should(ping(chat)).not.exactly("pong");
    });
});
describe('unit test recall service', function () {
    it('should discard null request', function () {
        var chat = {
        };
        should(recall(chat)).be.exactly(undefined);
    });
    it('should produce recall entry not found response', function () {
        var chat = {
            text: "Aiko, recall test"
        };
        should(recall(chat)).be.exactly("Ehehe, what does \"test\" mean again?");
    });
    it('should respond invalid remember request', function () {
        var chat = {
            text: "Aiko, remember test"
        };
        should(recall(chat)).be.exactly("I'm sorry, I didn't quite catch that");
    });
     it('should respond to valid remember request', function () {
        var chat = {
            text: "Aiko, remember test->passed"
        };
        should(recall(chat)).be.exactly("Okay, I have memorized \"test\" as \"passed\"");
    });
});
describe('unit test dice roller service', function () {
    it('should produce no dice response', function () {
        var chat = {
            text: "Aiko, roll dice"
        };
        should(roller(chat)).be.exactly("There\'s no spoon...I mean valid dice");
    });
    it('should produce invalid ping response', function () {
        var chat = {

        };
        should(roller(chat)).be.exactly(undefined);
    });
});