'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
//const Invite = require('models/invite');
//const User = require('models/user');
//const Round = require('models/round');
//const Invite = require('models/invite');

//const Game = require('models/game');
//const Emoji = require('models/emoji');
//const rule = require('config/rule');
//const _ = require('lodash');
//var Message = require('../../models/message');

module.exports = ( user, input ) => {
  console.info( 'onboarding', user );
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
    console.info('start the game');
    return require('../game/start')(user, input);
  }
};
