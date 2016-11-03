'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const User = require('models/user');
const _ = require('lodash');
const api = require('../service')('api');

const Phrase = {
  guess: (params) => {
    return api('phrases', 'guess', params);
  },
};

module.exports = Phrase;
