'use strict';
const _ = require('lodash');
const Game = require('models/game');
const rule = require('config/rule');
const Promise = require('bluebird');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('help').test(input) ) {
    return require('../players/help')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    let game = yield Game.get({ player: player, game_number: game_number });

    let ending_messages = [];
    let round = yield Game.newRound(game);

    let suggestion = {
      key: 'game-next-round-suggestion',
      options: [
        round.submitter.nickname,
        round.phrase
      ]
    };

    let nextRoundInstructions = {
      key: 'game-next-round',
      options: [
        round.submitter.nickname,
      ]
    };

    ending_messages = round.game.players.map(function(game_player) {
      if ( game_player.id !== round.submitter.id ) {
        return _.assign( { player: game_player }, nextRoundInstructions);
      } else {
        return _.assign( { player: game_player }, suggestion);
      }
    });

    return game.players.map(function(game_player) {
      if ( game_player.id === player.id ) {
        return {
          player: game_player,
          key: 'pass-initiator',
          //options: [player.nickname]
        };
      } else {
        return {
          player: game_player,
          key: 'player-passed',
          options: [player.nickname]
        };
      }
    }).concat(ending_messages);

  } else {
    let type_of_input = Game.checkInput(input);

    if ( type_of_input === 'text' ) {
      return require('../players/say')(player, input, game_number);
    //} else if ( type_of_input === 'mixed-emoji' ) {
      //return require('../players/say')(player, input, game_number).then(function(responses) {
        //return responses.concat([
          //{
            //player: player,
            //key: 'mixed-emoji',
            //options: [player.nickname]
          //}
        //]);
      //});
    //} else if ( type_of_input === 'emoji' ) {
    } else {
      try {
      let game = yield Game.saveSubmission(player, input, game_number);
      let messages = [{
        player: player,
        key: 'game-submission-sent'
      }];

      let forwarded_message = {
        key: 'emojis',
        options: [
          game.round.submitter.nickname,
          game.round.submitter.avatar,
          input 
        ]
      };

      let guessing_instructions = {
        key: 'guessing-instructions'
      };

      game.round.players.map(function(game_player) {
        messages.push(_.assign({ player: game_player }, forwarded_message));
      });

      game.round.players.map(function(game_player) {
        messages.push(_.assign({ player: game_player }, guessing_instructions));
      });
      return messages;
      } catch(err) {
        console.error('there is an error', error);
        if ( error && parseInt(error.message) ) {
          return [{
            player: player,
            key: 'error-' + error.message,
            options: [input]
          }];
        } else {
          throw error;
        }
      }
    }
  }
});
