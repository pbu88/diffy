var expect = require('chai').expect;
var config = require('../src/config');

describe('Config Tests', () => {
    it('should read analytics key from env', () => {
        expect(config.GA_ANALITYCS_KEY).to.be.equal('fake key');
    });
});
