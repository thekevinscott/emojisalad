'use strict';
const Promise = require('bluebird');
const rule = require('config/rule');
const Player = require('models/player');
const User = require('models/user');
const Game = require('models/game');
const Invite = require('models/invite');
const kickoffGame = require('../shared/kickoffGame');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return [{
      player: player,
      key: 'wait-to-invite'
    }];
  } else if ( rule('new-game').test(input) ) {
    return [{
      player: player,
      key: 'error-13'
    }];
  } else {
    // Once you set a nickname, we presume you're ready for
    // the big leagues.
    //
    // A.K.A., it's time to associate you with a game.
    let inviter = yield Invite.getInviter(player);
    if ( inviter ) {
      // if you've been invited, that means a
      // game already exists.
      player.user = yield User.update({ id: player.user.id }, {
        nickname: input
      });
      player.nickname = input;
      player.inviter = inviter;

      return yield kickoffGame(player, input, game_number);

    } else {
      return yield createGame(player, input, game_number);
    }
  }
});

var createGame = Promise.coroutine(function* (player, input, game_number) {
  Game.create().then(function(game) {
    return Game.add(game, [player], game_number);
  }).catch(function(err) {
    console.error('error adding player 1', err, player);
  });

  player = yield Player.update(player, {
    state: 'waiting-for-invites',
  });
  User.update({ id: player.user.id }, {
    nickname: input
  });

  return [{
    player: player,
    key: 'intro_3',
    options: [input]
  }];
});
