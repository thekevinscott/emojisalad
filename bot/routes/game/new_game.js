'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
const rule = require('config/rule');
const Game = require('models/game');
const User = require('models/user');

module.exports = (player, user = null) => {
  return new Promise((resolve) => {
    if ( user ) {
      resolve(user);
    } else {
      return User.get({
        player_id: player.id
      }).then((users) => {
        resolve(users.pop());
      });
    }
  }).then((user) => {
    console.info('user', user);
    if ( user.number_of_players < user.maximum_games ) {
      console.info('create the game');
      return Game.create([user]).then((game) => {
        const new_player = game.players.filter((game_player) => {
          return game_player.user_id === user.id;
        }).pop();

        return [{
          player: new_player,
          key: 'new-game',
          //from: participant.game_number,
          options: [
            new_player.nickname,
            new_player.avatar
          ]
        }];
      });
    } else {
      console.info('dont create the game');
      return [{
        player: player,
        key: 'error-maximum-games',
      }];
    }
  });
};
