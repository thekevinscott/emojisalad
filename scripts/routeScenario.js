var Promise = require('bluebird');
var _ = require('lodash');
var mapScenarios;

var methods = require('./methods');

function reject(message) {
  return Promise.reject({
    message: message
  });
}

function processMethod(scenario, data) {
  var type = scenario.type;
  if ( ! type ) {
    return reject('You must provide a valid scenario type');
  } else if ( !methods[type] ) {
    return reject('Scenario type does not exist: ' + type);
  } else {
    if ( ! data ) {
      data = {};
    }
    return methods[type](scenario, data.user, data.incomingPattern).then(function(response) {
      if ( scenario.callback ) {
        var pattern = scenario.callback.fn(response);
        var scenarios = scenario.scenarios;
        return mapScenarios.call(null, scenario.callback.scenarios, data, true).then(function(callbackResponse) {
          response.callbackResponse = callbackResponse;
          return response;
        });
      } else {
        return response;
      }
    });
  }
}

function routeScenario(scenarios, data, flags) {
  if ( ! mapScenarios ) {
    // lazy load mapScenarios to avoid a circular dependency issue
    mapScenarios = require('./mapScenarios');
  }

  if ( ! scenarios ) {
    return reject('You must provide scenarios');
  } else if ( !_.isArray(scenarios) ) {
    return reject('You must provide a valid scenarios array');
  }

  if ( ! flags ) {
    flags = {};
  }

  if ( flags.sync ) {
    /*
     * SWEET JESUS THIS IS UGLY
     *
     * This is basically a hack to chain multiple
     * promises together so they can be executed
     * synchronously.
     *
     * There's gotta be a native way to do this with
     * Bluebird but I didn't care to figure out how.
     */
    var promise = new Promise(function(resolve) {
      return resolve();
    });
    var values = [];

    scenarios.map(function(scenario) {
      promise = promise.then(function(response) {
        values.push(response);
        return processMethod(scenario, data);
      });
    });


    promise = promise.then(function(response) {
      values.shift();
      values.push(response);
      return values;
    });
    return promise;
  } else {
    return Promise.all(scenarios.map(function(scenario) {
      return processMethod(scenario, data);
    }));
  }

}

module.exports = routeScenario;
