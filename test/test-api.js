var should = require('should/as-function');
var app = require("../server");

describe('test server', function () {
    it('should be true', function () {
        should(5).be.exactly(5).and.be.a.Number();
    });
});