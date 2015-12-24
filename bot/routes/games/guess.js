'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var Player = require('models/player');
var Game = require('models/game');
var Round = require('models/round');
var rule = require('config/rule');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  console.debug('top of guess route');
  if ( rule('invite').test(input) ) {
    console.debug('invite in guess');
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    console.debug('new game in guess');
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    console.debug('pass in guess');
    return require('../games/pass')(player, input, game_number);
  } else if ( rule('clue').test(input) ) {
    console.debug('clue in guess');
    return require('../games/clue')(player, input, game_number);
  } else if ( rule('guess').test(input) ) {
    console.debug('GUESS in guess');
    let messages = [];
    if ( player.state === 'passed' ) {
      console.debug('user already passed');
      messages.push({
        player: player,
        key: 'no-guessing-after-passing'
      });
    } else {
      console.debug('checking guess');
      let game = yield Game.get({ player: player });

      console.debug('game', game);
      let guess = rule('guess').match(input);
      console.debug('the guess', guess);

      messages = game.players.map(function(game_player) {
        if ( game_player.id !== player.id ) {
          return {
            key: 'says',
            player: game_player,
            options: [
              player.nickname,
              player.avatar,
              guess,
            ]
          };
        }
      }).filter((el) => el);

      //let guesses_left = yield Round.getGuessesLeft(game, player);
      let result = yield Game.checkGuess(game, player, guess);
      console.debug('result of the guess', result);
      if ( result ) {
        for ( var i=0; i<game.players.length; i++ ) {
          let game_player = game.players[i];
          messages.push({
            key: 'correct-guess',
            player: game_player,
            options: [
              player.nickname,
              player.avatar,
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
                benchedPlayer.nickname,
                benchedPlayer.avatar
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
            round.submitter.avatar,
            round.phrase
          ]
        };

        var nextRoundInstructions = {
          key: 'game-next-round',
          options: [
            round.submitter.nickname,
            round.submitter.avatar
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
      }
    }
    return messages;
  } else {
    return require('../players/say')(player, input, game_number);
  }
});

