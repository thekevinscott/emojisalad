var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');
var sprintf = require('sprintf');

var mockrequire = require('mockrequire');
var mapScenarios = require('../../../scripts/mapScenarios');
var checkScenario = require('../../../scripts/checkScenario');
var mapActions = require('../../../scripts/mapActions');
var methods = require('../../../scripts/methods');
var Message = require('../../../models/message');

var config = require('../../fixtures/script/basic-config') ;

var script = mockrequire('../../../scripts/index', {
  'bluebird': Promise,
  './config': config,
});

describe('script index', function() {
  it('should throw error if no valid script element is found for a key', function() {
    return script('non-existent-key').catch(function(e) {
      e.message.should.equal('No config element found for message key: non-existent-key');
    });
  });

  it('should call mapScenarios with a particular scenario', function() {
    var stub = sinon.stub(mapScenarios, 'call', function() {
      return Promise.resolve({
        foo: 'bar'
      });
    });
    return script('foo').then(function(response) {
      stub.restore();
      response.foo.should.equal('bar');
    });
  });

  describe('Processing the script', function() {
    var stubs = [];
    var called = 0;

    beforeEach(function() {
      ['respond', 'request'].map(function(method) {
        stubs.push(sinon.stub(methods, method, function(scenario, data) {

          var params = {
              method: method
          };
          if ( method === 'request' ) {
            params.url = scenario.url;
          } else if ( method === 'respond' ) {
            //console.log('data', scenario, data);
            params.message = sprintf(scenario.message, data);
          }

          var deferred = Promise.pending();
          setTimeout(function() {
            called++;
            deferred.resolve(params);
          }, 2);
          return deferred.promise;
        }));
      });
    });

    afterEach(function() {
      called = 0;
      stubs.map(function(stub) {
        stub.restore();
      });
      stubs = [];
    });

    it('should map over actions', function() {
      return script('two-actions').then(function(response) {
        called.should.equal(2);
        response.should.deep.equal([
          {
            message: 'wait-to-invite',
            method: 'respond'
          },
        ]);
      });
    });

    it('should process callbacks', function() {
      var key = 'waiting-for-nickname';
      var user = {
        id: 1
      };
      var message = 'My nickname is Frank';
      return script(key, user, message).then(function(response) {
        //called.should.equal(6);
        response.should.deep.equal([
          {
            message: 'foo',
            method: 'respond'
          },
          {
            message: 'intro_3',
            method: 'respond'
          },
          {
            message: 'intro_4',
            method: 'respond'
          },
          {
            message: 'deepest message',
            method: 'respond'
          },
          {
            message: 'deepest message '+message+' waiting-for-players',
            method: 'respond'
          },
        ]);
      });
    });
  });
});
