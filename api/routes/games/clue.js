'use strict';
//var Player = require('../../models/player');
//var Message = require('../../models/message');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  if ( player.state === 'passed' ) {
    return [{
      player: player,
      key: 'no-clue-after-passing'
    }];
  } else {
    let game = yield Game.get({ player: player, game_number: game_number });
    let clues_left = yield Round.getCluesLeft(game);
    let message;
    /*
    if ( clues_left > 0 ) {
      let roundClue = yield Round.getClue(game, player);
      if ( roundClue ) {
        message = {
          key: 'clue',
          options: [
            player.nickname,
            roundClue.clue
          ]
        };
      } else {
        message = {
          key: 'no-more-clues-available',
        };
      }
    } else {
      var clues_allowed = game.round.clues_allowed;
      clues_allowed = (clues_allowed === 1) ? '1 clue' : clues_allowed + ' clues';

      message = {
        key: 'no-more-clues-allowed',
        options: [
          clues_allowed
        ]
      };
    }
    */
    let roundClue = yield Round.getClue(game, player);
    message = {
      key: 'clue',
      options: [
        player.nickname,
        roundClue.clue
      ]
    };
    let messages = game.players.map(function(game_player) {
      return _.assign({
        player: game_player,
      }, message);
    });

    messages = game.players.map(function(game_player) {
      if ( game_player.id !== player.id ) {
        return {
          key: 'says',
          player: game_player,
          options: [
            player.nickname,
            player.avatar,
            input
          ]
        };
      }
    }).filter((el) => el).concat(messages);

    return messages;
  }
});

