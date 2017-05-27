var should = require('should/as-function');
var app = require("../server");
var request = require('supertest');

describe('test server', function () {
    it('should be true', function () {
        should(5).be.exactly(5).and.be.a.Number();
    });
});

describe('test router', function () {
    it('should return chat log page', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
    it('should return Aiko\'s status', function (done) {
        request(app)
            .get('/api/status')
            .expect(200, "Aiko is sleeping...", done);
    });
    it('should wake up Aiko', function (done) {
        request(app)
            .get('/api/start')
            .expect(200, "Waking Aiko up...", done);
    });
    it('should stop Aiko', function (done) {
        request(app)
            .get('/api/stop')
            .expect(200, "Sending Aiko to bed...", done);
    });
    it('should get raw chat log', function (done) {
        request(app)
            .get('/log')
            .expect(200, done);
    });
    it('should not return botframework webhook (404)', function (done) {
        request(app)
            .get('/api/messages')
            .expect(404, done);
    });
        it('should return unauthorized request to botframework webhook (401)', function (done) {
        request(app)
            .post('/api/messages')
            .send({ foo: 'bar' })
            .expect(401, done);
    });
});