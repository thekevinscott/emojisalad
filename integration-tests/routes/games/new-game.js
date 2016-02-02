'use strict';
const Game = require('models/game');
const Player = require('models/player');
const User = require('models/user');
//const Round = require('models/round');
const _ = require('lodash');
//const rule = require('config/rule');
const Promise = require('bluebird');

module.exports = Promise.coroutine(function *(player) {
  //if ( rule('new-game').test(input) ) {
    //let games = yield Player.getGames(player);
    let players = yield User.getPlayersNum(player.user);
    if ( players < player.user.maximum_games) {
      let game = yield Game.create();
      let new_player = yield Player.create({ user: player.user, initial_state: 'waiting-for-invites'  });
      yield Game.add(game, [_.assign({ initial_state: 'waiting-for-invites' }, new_player)]);

      // we expect an array of participants,
      // even though that array should only have
      // one element.
      //let participant = participants[0];
      return [{
        player: new_player,
        key: 'new-game',
        //from: participant.game_number,
        options: [
          new_player.nickname
        ]
      }];
    } else {
      return [{
        player: player,
        key: 'error-maximum-games',
        //from: game_number
      }];
    }
  //}
});
