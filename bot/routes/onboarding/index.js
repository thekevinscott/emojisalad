'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
const _ = require('lodash');
//var Message = require('../../models/message');

module.exports = (user, input) => {
  console.info('onboarding');
  if ( ! user.confirmed ) {
    return require('./confirm')(user, input);
  } else if ( ! user.nickname ) {
    return require('./nickname')(user, input);
  } else if ( ! user.avatar ) {
    return require('./avatar')(user, input);
  }
};
