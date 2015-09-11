var Promise = require('bluebird');
var _ = require('lodash');

var sequence = function(fns) {
  return Promise.reduce(fns, function(response, fn) {
    if ( ! _.isFunction(fn) ) {
      console.error('invalid function', fn);
      throw "You must provide a valid function";
    }
    return fn().then(function(output) {
      return response.concat(output);
    });
  }, []);
}

module.exports = sequence;
