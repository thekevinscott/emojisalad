'use strict';
const Promise = require('bluebird');
const rule = require('config/rule');
const Player = require('models/player');
const User = require('models/user');
const Game = require('models/game');
const Invite = require('models/invite');

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
    player.user = yield User.update({ id: player.user.id }, {
      nickname: input,
    });
    player.nickname = input;

    yield Player.update(player, {
      state: 'waiting-for-avatar'
    });

    return [{
      key: 'intro_3',
      player: player,
      options: [
        player.nickname,
        player.avatar
      ]
    }];
  }
});

