'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var Player = require('models/player');
var Game = require('models/game');
var Round = require('models/round');
var rule = require('config/rule');

module.exports = function(player, input, game_number) {
  const promises = [];
  
  if ( rule('invite').test(input) ) {
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(player, input, game_number);
  } else if ( rule('clue').test(input) ) {
    return require('../games/clue')(player, input, game_number);
  } else if ( rule('guess').test(input) ) {
    if ( player.state === 'passed' ) {
      return [{
        player: player,
        key: 'no-guessing-after-passing'
      }];
    } else {
      return Game.get({ player: player, game_number: game_number }).then(function(game) {
        var messages = game.players.map(function(game_player) {
          var guess = rule('guess').match(input);
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

        return Round.getGuessesLeft(game, player).then(function(guesses_left) {
          if ( guesses_left > 0 ) {
            var guess = rule('guess').match(input);
            return Game.checkGuess(game, player, guess).then(function(result) {
              if ( result ) {
                return Game.updateScore(game, player, 'win-round').then(function(game) {
                  let score = game.players.map(function(game_player) {
                    return game_player.nickname + ': ' + game_player.score;
                  }).join('\n');

                  game.players.map(function(game_player) {
                    messages.push({
                      key: 'correct-guess',
                      player: game_player,
                      options: [
                        player.nickname,
                        game.round.phrase,
                        score
                      ]
                    });
                  });

                  // are there any players waiting in the wings?
                  game.players.filter(function(game_player) {
                    // this player is about to join
                    return game_player.state === 'bench';
                  }).map(function(benchedPlayer) {
                    game.players.map(function(game_player) {
                      messages.push({
                        key: 'join-game',
                        options: [
                          benchedPlayer.nickname
                        ],
                        player: game_player
                      });
                    });
                  });

                  promises.push(Game.newRound(game).then(function(round) {
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
                    round.game.players.map(function(game_player) {
                      if ( game_player.id !== round.submitter.id ) {
                        messages.push(_.assign( { player: game_player }, nextRoundInstructions));
                      } else {
                        messages.push(suggestion);
                      }
                    });
                  }));

                  return Promise.all(promises).then(function() {
                    return messages;
                  });
                });
              } else {
                // we do a request to get the up-to-date
                // guesses, after setting it earlier
                return Round.getGuessesLeft(game, player).then(function(guesses_left) {
                  // does the player still have guesses left over?
                  if ( guesses_left > 0 ) {
                    return {
                      key: 'incorrect-guess',
                      options: [player.nickname]
                    };
                  } else {
                    return Player.update(player, { state: 'lost' }).then(function() {
                      // does the game have ANY players with guesses left?
                      return Game.getGuessesLeft(game);
                    }).then(function(guesses_left) {
                      console.debug('how many guesses be left', guesses_left);
                      if ( guesses_left > 0 ) {
                        console.debug('player is out of guesses ' + player.id);
                        return {
                          key: 'incorrect-out-of-guesses'
                        };
                      } else {
                        console.debug('the round is over');
                        // start a new round
                        return {
                          key: 'round-over'
                        };
                      }
                    });
                  }
                }).then(function(message) {
                  game.players.map(function(game_player) {
                    messages.push(_.assign({ player: game_player }, message));
                  });

                  if ( message.key === 'round-over' ) {
                    console.debug('proceed with the round over');
                    return Game.newRound(game).then(function(round) {
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

                      round.game.players.map(function(game_player) {
                        if ( game_player.id !== round.submitter.id ) {
                          messages.push(_.assign( { player: game_player }, nextRoundInstructions));
                        } else {
                          messages.push(_.assign( { player: game_player }, suggestion));
                        }
                      });
                    }).then(function() {
                      return messages;
                    });
                  } else {
                    return messages;
                  }
                });
              }

            });
          } else {

            var message = {
              key: 'out-of-guesses'
            };

            message.options = [
              player.nickname
            ];
            game.players.map(function(game_player) {
              messages.push(_.assign({ player: game_player }, message));
            });
            return messages;
          }
        });
      });
    }
  } else {
    return require('../players/say')(player, input, game_number);
  }
};

