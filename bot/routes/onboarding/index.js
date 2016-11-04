'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
const Challenge = require('models/challenge');
//const User = require('models/user');
//const Round = require('models/round');
//const Invite = require('models/invite');

//const Game = require('models/game');
//const Emoji = require('models/emoji');
//const rule = require('config/rule');
//const _ = require('lodash');
//var Message = require('../../models/message');

module.exports = ({
  user,
  message,
}) => {
  console.info( 'onboarding', user );
  //console.info( 'onboarding', message, user );
  if ( ! user.confirmed ) {
    console.info('go to confirm');
    return require('./confirm')(user, message);
  } else if ( ! user.nickname ) {
    console.info('go to nickname');
    return require('./nickname')(user, message);
  } else if ( ! user.confirmed_avatar ) {
    console.info('go to avatar');
    return require('./avatar')(user, message);
  } else {
    console.info('none of the above');
    return Invite.get({
      invited_id: user.id,
      used: 0
    }).then((invites) => {
      console.info('invites back', invites);
      if ( invites.length && invites[0].game ) {
        console.info('start the game!');
        return require('../game/start')(user, message);
        //console.info('existing user has been invited to a new game');
        //return Game.add(invites[0].game, [user]).then((game) => {
          //return Invite.use(_.assign({ game_id: game.id },invites[0])).then(() => {
          //});
        //});
      } else if ( parseInt(user.number_of_players, 10) > 0 ) {
        return require('../game/new_game')(user);
      } else {
        console.info('start the game');
        return require('../game/start')(user, message);
      }
    });
  }
};
