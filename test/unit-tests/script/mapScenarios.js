var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

var mapScenarios = require('../../../scripts/mapScenarios');
var checkScenario = require('../../../scripts/checkScenario');
var mapActions = require('../../../scripts/mapActions');

describe('mapScenarios', function() {
  it('should check valid input', function() {
  });

  it('should return a rejected promise if no scenarios are provided', function() {
    return mapScenarios([]).catch(function(e) {
      e.should.exist;
    });
  });

  it('should return a rejected promise if no scenarios pass', function() {
    var stub = sinon.stub(checkScenario, 'call', function() {
      return false;
    });
    var scenarios = [
      {
        regex: 'foo'
      },
      {
        regex: 'foo'
      }
    ];
    return mapScenarios(scenarios).catch(function(e) {
      stub.restore();
      e.should.exist;
    });
  });

  it.only('should return a result if a scenario passes', function() {
    var called = false;
    var actionStub = sinon.stub(mapActions, 'call', function(self, opts) {
      opts.should.contain('baz');
      called = true;
      return Promise.resolve({
        success: 1
      });
    });
    var regexStub = sinon.stub(checkScenario, 'call', function(self, regex) {
      if ( regex === 'bar' ) {
        return true;
      } else {
        return false;
      }
    });
    var scenarios = [
      {
        regex: 'foo'
      },
      {
        regex: 'bar',
        scenarios: [
          'baz'
        ]
      }
    ];
    return mapScenarios(scenarios, {}, 'baz').then(function(response) {
      console.log('response', response);
      response.success.should.equal(1);
      regexStub.restore();
      actionStub.restore();
    });
  });
});
