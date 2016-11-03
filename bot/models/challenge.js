'use strict';

const api = require('../service')('api');

const Challenge = {
  get: (params) => {
    return api('challenges', 'get', params);
  }
};

module.exports = Challenge;

