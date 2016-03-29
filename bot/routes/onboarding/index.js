'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
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
  //console.log( 'onboarding', input, user );
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
    return Invite.get({
      invited_id: user.id,
      used: 0
    }).then((invites) => {
      if ( invites.length && invites[0].game ) {
        return require('../game/start')(user, input);
        //console.info('existing user has been invited to a new game');
        //return Game.add(invites[0].game, [user]).then((game) => {
          //return Invite.use(_.assign({ game_id: game.id },invites[0])).then(() => {
          //});
        //});
      } else if ( parseInt(user.number_of_players, 10) > 0 ) {
        console.info('new game');
        return require('../game/new_game')(user, input);
        //return require('../game/start')(user, input);
      } else {
        console.info('start the game');
        return require('../game/start')(user, input);
      }
    });
  }
};
