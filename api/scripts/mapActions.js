var Promise = require('bluebird');
var _ = require('lodash');
var mapScenarios;

var methods = require('./methods');

function reject(message) {
  return Promise.reject({
    message: message
  });
}

function processMethod(action, data) {
  var type = action.type;
  console.log('type', type);
  if ( ! type ) {
    return reject('You must provide a valid action type');
  } else if ( !methods[type] ) {
    return reject('Action type does not exist: ' + type);
  } else {
    return methods[type](action, data).then(function(response) {
      console.log('response back from type', type, response);
      // we get response back as an object, but we want to convert it to an array.
      // this is so we can append any potential callback objects onto it.
      // later on (after this call returns) we'll flatten the final array
      response = [_.assign({},response,{type:type})];
      if ( action.callback ) {
        data.args.push({
          pattern: action.callback.fn(response)
        });
        return mapScenarios.call(null, action.callback.scenarios, data).then(function(callback) {
          return callback;
        }).then(function(callback) {
          console.log('action', action);
          if ( action.type === 'respond' || action.type === 'sms' ) {
            return response.concat(callback);
          } else {
            return [].concat(callback);
          }
        });
      } else {
        // only certain types need to actually return their responses;
        if ( action.type === 'respond' || action.type === 'sms') {
          return response;
        }
      }
    });
  }
}

function flatten(ary) {
    var ret = [];
    for(var i = 0; i < ary.length; i++) {
        if(Array.isArray(ary[i])) {
            ret = ret.concat(flatten(ary[i]));
        } else {
            ret.push(ary[i]);
        }
    }
    return ret;
}
function cleanArray(arr) {
  return flatten(arr).filter(function(response) {
    // only return valid responses, as some methods
    // return nothing
    if ( response ) {
      return response;
    }
  });
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
    }).then(cleanArray);
    return promise;
  } else {
    // this is the async version
    return Promise.all(actions.map(function(action) {
      return processMethod(action, data);
    })).then(cleanArray);
  }

}

module.exports = mapActions;
