'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const Game = require('models/game');
const Emoji = require('models/emoji');
const rule = require('config/rule');
const kickoffGame = require('../shared/kickoffGame');
//var Message = require('../../models/message');

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
  } else if ( rule('keep').test(input) ) {
    console.debug('keep is matched');
    return startGame(player, input, game_number);
  } else {
    console.debug('keep is not matched', input);
    let result = Emoji.checkInput(input);
    console.debug('keep result', result);
    if ( result === 'emoji' ) {
      let number_of_emoji = Emoji.getNumOfEmoji(input);
      if ( number_of_emoji === 1 ) {
        // also check length of emoji
        player.user = yield User.update({ id: player.user.id }, {
          avatar: input
        });
        player.avatar = input;
        return startGame(player, input, game_number);
      } else {
        return [{
          player: player,
          key: 'error-14'
        }];
      }
    } else {
      return [{
        player: player,
        key: 'error-14'
      }];
    }
  }
});

const startGame = Promise.coroutine(function* (player, input, game_number) {
  // Once you set a nickname, we presume you're ready for
  // the big leagues.
  //
  // A.K.A., it's time to associate you with a game.
  let inviter = yield Invite.getInviter(player);
  if ( inviter ) {
    // if you've been invited, that means a
    // game already exists.
    //player.user = yield User.update({ id: player.user.id }, {
      //avatar: input
    //});
    player.inviter = inviter;

    return yield kickoffGame(player, input, game_number);

  } else {
    return yield createGame(player, input, game_number);
  }
});

const createGame = Promise.coroutine(function* (player, input, game_number) {
  Game.create().then(function(game) {
    return Game.add(game, [player], game_number);
  }).catch(function(err) {
    console.error('error adding player 1', err, player);
  });

  player = yield Player.update(player, {
    state: 'waiting-for-invites',
  });

  return [{
    player: player,
    key: 'intro_4',
    options: [player.nickname, player.avatar]
  }];
});
