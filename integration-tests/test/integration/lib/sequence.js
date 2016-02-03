'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

const sequence = (fns) => {
  return Promise.reduce(fns, (response, fn) => {
    if ( ! _.isFunction(fn) ) {
      console.error('invalid function', fn);
      throw "You must provide a valid function";
    }
    return fn().then(function(output) {
      return response.concat(output);
    });
  }, []);
};

module.exports = sequence;
