'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  if ( rule('invite').test(message) ) {
    return require('./invite')(player, message);
  } else {
    return [];
  }
};
