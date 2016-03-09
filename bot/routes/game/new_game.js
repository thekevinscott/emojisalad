'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
//const rule = require('config/rule');
const Game = require('models/game');
const User = require('models/user');

module.exports = (user_params) => {
  console.info('new game', user_params);
  return new Promise((resolve) => {
    if ( user_params.number_of_players ) {
      resolve(user_params);
    } else {
      return User.get({
        id: user_params.id
      }).then((users) => {
        resolve(users.pop());
      });
    }
  }).then((user) => {
    console.info('user', user);
    console.info('number of players', user.number_of_players);
    console.info('maximum games', user.maximum_games);
    if ( parseInt(user.number_of_players, 10) < parseInt(user.maximum_games, 10) ) {
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
        player: _.assign({
          to: user_params.to
        }, user),
        key: 'error-maximum-games'
      }];
    }
  });
};
