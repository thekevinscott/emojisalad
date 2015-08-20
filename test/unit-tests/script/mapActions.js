var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

var mapActions = require('../../../scripts/mapActions');
var methods = require('../../../scripts/methods');

describe('mapActions', function() {

  it('should throw errors for required data', function() {
    mapActions().catch(function(e) {
      e.message.should.equal('You must provide action');
    });
    mapActions('foo').catch(function(e) {
      e.message.should.equal('You must provide a valid actions array');
    });
  });

  it('should return a promise', function() {
    return mapActions([]);
  });

  it('should throw an error if no scenario type is provided', function() {
    return mapActions([
      {}
    ]).catch(function(e) {
      e.should.exist;
      e.message.should.equal('You must provide a valid action type');
    });
  });

  it('should throw an error if an unsupported scenario type is provided', function() {
    return mapActions([
      {
        type: 'foo'
      }
    ]).catch(function(e) {
      e.should.exist;
      e.message.should.equal('Action type does not exist: foo');
    });
  });

  it('should route to the appropriate method handler', function() {
    var called = false;
    var stub = sinon.stub(methods, 'respond', function() {
      called = true;
      stub.restore();
      return Promise.resolve({});
    });
    var data = {
      user: 'foo'
    }
    return mapActions([
      {
        type: 'respond'
      }
    ], data).then(function() {
      called.should.equal(true);
    });
  });

  it('should route parameters to the appropriate method handler', function() {
    var stub = sinon.stub(methods, 'respond', function(scenario, data) {
      stub.restore();
      return Promise.resolve({
        scenario: scenario,
        user: data.user,
        pattern: data.pattern
      });
    });
    var scenario = [{
      type: 'respond',
      message: 'the-message-key'
    }];
    var user = {
      id: 1
    };
    pattern = 'foo';
    var data = {
      user: user,
      pattern: pattern
    }
    return mapActions(scenario, data).then(function(opts) {
      opts = opts[0];
      opts.pattern.should.equal(pattern);
      opts.user.should.deep.equal(user);
      opts.scenario.should.equal(scenario[0]);
    });
  });

  describe('Synchronicity', function() {
    var stubs = [];
    afterEach(function() {
      stubs.map(function(stub) {
        stub.restore();
      });
      stubs = [];
    });

    it('should, by default, run promises asynchronously', function() {
      var respondCalled = false;
      var requestCalled = false;
      stubs.push(sinon.stub(methods, 'request', function(scenario, user, pattern) {
        requestCalled = true;
        respondCalled.should.equal(false);
        return Promise.resolve({
          scenario: scenario,
          user: user,
          pattern: pattern 
        });
      }));
                  
      stubs.push(sinon.stub(methods, 'respond', function(scenario, user, pattern) {
        var deferred = Promise.pending();
        setTimeout(function() {
          respondCalled = true;
          requestCalled.should.equal(true);

          deferred.resolve({
            scenario: scenario,
            user: data.user,
            pattern: data.pattern 
          });
        }, 2);
        return deferred.promise;
      }));

      var scenarios = [
        {
          type: 'respond',
          message: 'bar'
        },
        {
          type: 'request',
          message: 'foo'
        }
      ];
      var data = {
        user: 'foo'
      }
      return mapActions(scenarios, data);
    });

    it('should run promises synchronously when passed a flag', function() {
      var respondCalled = false;
      var requestCalled = false;
      stubs.push(sinon.stub(methods, 'request', function(scenario, data) {
        requestCalled = true;
        respondCalled.should.equal(true);
        return Promise.resolve({
          scenario: scenario,
          user: data.user,
          pattern: data.pattern
        });
      }));
                  
      stubs.push(sinon.stub(methods, 'respond', function(scenario, data) {
        var deferred = Promise.pending();
        setTimeout(function() {
          respondCalled = true;
          requestCalled.should.equal(false);

          deferred.resolve({
            scenario: scenario,
            user: data.user,
            pattern: data.pattern
          });
        }, 2);
        return deferred.promise;
      }));

      var scenarios = [
        {
          type: 'respond',
          message: 'bar'
        },
        {
          type: 'request',
          message: 'foo'
        }
      ];
      var flags = {
        sync: true
      };
      var data = {
        user: 'foo'
      }
      return mapActions(scenarios, data, flags);
    });
  });
});
