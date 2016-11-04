'use strict';

const api = require('../service')('api');

const Challenge = {
  get: (params) => {
    return api('challenges', 'get', params);
  },
  guess: (params) => {
    return api('challenges', 'guess', params);
  },
  guesses: (params) => {
    return api('challenges', 'guesses', params);
  },
};

module.exports = Challenge;

