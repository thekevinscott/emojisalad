var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');
var sprintf = require('sprintf');

console.log('i am index');
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
              type: method
          };
          if ( method === 'request' ) {
            params.url = scenario.url;
          } else if ( method === 'respond' ) {

            console.log('our scenario', scenario);
            if ( scenario.options ) {
              var options = scenario.options.map(function(option) {
                console.log(option, data);
                var val = sprintf(option, data)
                console.log('val', val);
                return val;
              });
            } else {
              var options = [];
            }


            params.message = sprintf.apply(null, [scenario.message].concat(options));
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
            type: 'respond'
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
            type: 'respond'
          },
          {
            message: 'intro_3',
            type: 'respond'
          },
          {
            message: 'intro_4',
            type: 'respond'
          },
          {
            message: 'deepest message',
            type: 'respond'
          },
          {
            message: 'deepest message '+message+' waiting-for-players',
            type: 'respond'
          },
        ]);
      });
    });

    describe('String processing', function() {
      it('should parse one level of invites', function() {
        var key = 'parsing-strings';
        var user = {
          id: 1
        };
        var message = 'invite       foo';
        return script(key, user, message).then(function(response) {
          response.should.deep.equal([
            {
              message: 'invited user: foo',
              type: 'respond'
            },
          ]);
        });
      });
    });
  });
});
