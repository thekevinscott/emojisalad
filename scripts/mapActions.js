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
        var actions = scenario.actions;
        return mapScenarios.call(null, scenario.callback.actions, data, true).then(function(callback) {
          return callback;
        }).then(function(callback) {
          console.log('what is cb', callback);
          console.log('what is response', response);
          return callback;
        });
      } else if ( scenario.type === 'respond' ) {
        return response;
      }
    }).then(function(response) {
      //only certain types need to actually return their responses;
      if ( scenario.type === 'respond' ) {
        return response;
      }
    });
  }
}

function mapActions(actions, data, flags) {
  if ( ! mapScenarios ) {
    // lazy load mapScenarios to avoid a circular dependency issue
    mapScenarios = require('./mapScenarios');
  }

  if ( ! actions ) {
    return reject('You must provide action');
  } else if ( !_.isArray(actions) ) {
    return reject('You must provide a valid actions array');
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

    actions.map(function(action) {
      promise = promise.then(function(response) {
        values.push(response);
        return processMethod(action, data);
      });
    });


    promise = promise.then(function(response) {
      values.shift();
      values.push(response);
      return values;
    });
    return promise;
  } else {
    return Promise.all(actions.map(function(action) {
      return processMethod(action, data);
    })).then(function(arr) {
      return arr.filter(function(response) {
        console.log('response', response);
        // only return valid responses, as some methods
        // return nothing
        if ( response ) {
          return response;
        }
      });
    });
  }

}

module.exports = mapActions;
