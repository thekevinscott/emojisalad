'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var Player = require('models/player');
var Game = require('models/game');
var Round = require('models/round');
var rule = require('config/rule');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  console.debug('guess route, then:');
  if ( rule('invite').test(input) ) {
    console.debug('invite route');
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    console.debug('new game route');
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    console.debug('pass route');
    return require('../games/pass')(player, input, game_number);
  } else if ( rule('clue').test(input) ) {
    console.debug('clue route');
    return require('../games/clue')(player, input, game_number);
  } else if ( rule('guess').test(input) ) {
    console.debug('guess! route');
    let messages = [];
    if ( player.state === 'passed' ) {
      messages.push({
        player: player,
        key: 'no-guessing-after-passing'
      });
    } else {
      let game = yield Game.get({ player: player });

      messages = game.players.map(function(game_player) {
        let guess = rule('guess').match(input);
        if ( game_player.id !== player.id ) {
          return {
            key: 'guesses',
            player: game_player,
            options: [
              player.nickname,
              guess,
            ]
          };
        }
      }).filter((el) => el);

      let guesses_left = yield Round.getGuessesLeft(game, player);
      var guess = rule('guess').match(input);
      let result = yield Game.checkGuess(game, player, guess);
      if ( result ) {
        for ( var i=0; i<game.players.length; i++ ) {
          let game_player = game.players[i];
          messages.push({
            key: 'correct-guess',
            player: game_player,
            options: [
              player.nickname,
              game.round.phrase,
            ]
          });
        }


        // are there any players waiting in the wings?
        game.players.filter(function(game_player) {
          // this player is about to join
          return game_player.state === 'bench';
        }).map(function(benchedPlayer) {
          for ( var i=0; i<game.players.length; i++ ) {
            let game_player = game.players[i];
            messages.push({
              key: 'join-game',
              options: [
                benchedPlayer.nickname
              ],
              player: game_player
            });
          }
        });

        let round = yield Game.newRound(game);

        round.players.map(function(game_player) {
          Player.update(game_player, {
            state: 'waiting-for-round',
          });
        });

        Player.update(round.submitter, {
          state: 'waiting-for-submission',
        });

        var suggestion = {
          key: 'game-next-round-suggestion',
          options: [
            round.submitter.nickname,
            round.phrase
          ]
        };

        var nextRoundInstructions = {
          key: 'game-next-round',
          options: [
            round.submitter.nickname,
          ]
        };

        suggestion.player = round.submitter;
        for ( var i=0; i<game.players.length; i++ ) {
          let game_player = game.players[i];
          if ( game_player.id !== round.submitter.id ) {
            messages.push(_.assign( { player: game_player }, nextRoundInstructions));
          } else {
            messages.push(suggestion);
          }
        }
      } else {
        let message = {
          key: 'incorrect-guess',
          options: [player.nickname]
        };

        for ( var i=0; i<game.players.length; i++ ) {
          messages.push(_.assign({ player: game.players[i] }, message));
        }
      }
    }
    return messages;
  } else {
    return require('../players/say')(player, input, game_number);
  }
});

