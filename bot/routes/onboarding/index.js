'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
const _ = require('lodash');
//var Message = require('../../models/message');

module.exports = (user, input) => {
  console.info('onboarding', user);
  if ( ! user.confirmed ) {
    console.info('go to confirm');
    return require('./confirm')(user, input);
  } else if ( ! user.nickname ) {
    console.info('go to nickname');
    return require('./nickname')(user, input);
  } else if ( ! user.confirmed_avatar ) {
    console.info('go to avatar');
    return require('./avatar')(user, input);
  } else {
    console.info('WTF');
    throw new Error('Should never get to the end of user onboarding');
  }
};
