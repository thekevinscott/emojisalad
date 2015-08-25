var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');

var parseInput = require('../../../scripts/parseInput');

describe('parseInput', function() {
  it('should return the input if no match is given', function() {
    expect(parseInput({ pattern: 'foo' }, 'foo')).to.equal('foo');
  });
  it('should return null if no match is found', function() {
    var regex = {
      pattern: '^invite(.*)',
      match: {
        pattern: '^invite(.*)'
      }
    };
    var name = 'foo';
    expect(parseInput(regex, 'hey '+name)).to.equal(null);
  });
  it('should parse a matching regex', function() {
    var regex = {
      pattern: '^invite(.*)',
      match: {
        pattern: '^invite\\s*(.*)'
      }
    };
    var name = 'foo';
    expect(parseInput(regex, 'invite '+name)).to.equal(name);
  });
  it('should strip white space out of response', function() {
    // this is more a test of the regex
    var regex = {
      pattern: '^invite(.*)',
      match: {
        pattern: '^invite\\s*(.*)'
      }
    };
    var name = 'foo';
    expect(parseInput(regex, 'invite        '+name)).to.equal(name);
  });
});
