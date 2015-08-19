var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('bluebird');

var checkScenario = require('../../../scripts/checkScenario');

describe('checkScenario', function() {
  it('should check a successful regex', function() {
    expect(checkScenario({ pattern: 'foo' }, 'foo')).to.equal(true);
  });
  it('should check a failed regex', function() {
    expect(checkScenario({ pattern: 'FOO' }, 'foo')).to.equal(false);
  });
  it('should pass additional flags', function() {
    expect(checkScenario({ pattern: 'FOO', flags: 'i' }, 'foo')).to.equal(true);
  });
});
