'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

const sequence = (fns) => {
  return Promise.reduce(fns, (response, fn) => {
    if ( _.isFunction(fn) ) {
      return fn().then((output) => {
        return response.concat(output);
      });
    } else {
      return response.concat(fn);
    }
  }, []);
};

module.exports = sequence;
