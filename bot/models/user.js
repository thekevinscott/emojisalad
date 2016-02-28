'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const api = require('../service')('api');

const User = {
  create: (params) => {
    return api('users', 'create', params);
  },
  update: (user, params) => {
    return api('users', 'update', params, { user_id: user.id });
  },
  get: function (params) {
    return api('users', 'get', params);
  },
};

module.exports = User;
