'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var User = require('models/user');
var Game = require('models/game');
var Round = require('models/round');
var rule = require('config/rule');

module.exports = function(user, input) {
  const promises = [];
  
  if ( rule('invite').test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(user, input);
  } else if ( rule('clue').test(input) ) {
    return require('../games/clue')(user, input);
  } else if ( rule('guess').test(input) ) {
    if ( user.state === 'passed' ) {
      return [{
        user: user,
        key: 'no-guessing-after-passing'
      }];
    } else {
      return Game.get({ user: user }).then(function(game) {
        var messages = game.players.map(function(player) {
          var guess = rule('guess').match(input);
          if ( player.id !== user.id ) {
            return {
              key: 'guesses',
              user: player,
              options: [
                user.nickname,
                guess,
              ]
            };
          }
        }).filter((el) => el);

        return Round.getGuessesLeft(game, user).then(function(guesses_left) {
          if ( guesses_left > 0 ) {
            var guess = rule('guess').match(input);
            return Game.checkGuess(game, user, guess).then(function(result) {
              if ( result ) {
                return Game.updateScore(game, user, 'win-round').then(function(game) {
                  let score = game.players.map(function(player) {
                    return player.nickname + ': ' + player.score;
                  }).join('\n');

                  game.players.map(function(player) {
                    messages.push({
                      key: 'correct-guess',
                      user: player,
                      options: [
                        user.nickname,
                        score
                      ]
                    });
                  });

                  // are there any users waiting in the wings?
                  game.players.filter(function(player) {
                    // this player is about to join
                    return player.state === 'bench';
                  }).map(function(benchedPlayer) {
                    game.players.map(function(player) {
                      messages.push({
                        key: 'join-game',
                        options: [
                          benchedPlayer.nickname
                        ],
                        user: player
                      });
                    });
                  });

                  promises.push(Game.newRound(game).then(function(round) {
                    round.players.map(function(player) {
                      User.update(player, {
                        state: 'waiting-for-round',
                      });
                    });
                    User.update(round.submitter, {
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

                    suggestion.user = round.submitter;
                    round.game.players.map(function(player) {
                      if ( player.id !== round.submitter.id ) {
                        messages.push(_.assign( { user: player }, nextRoundInstructions));
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
                return Round.getGuessesLeft(game, user).then(function(guesses_left) {
                  // does the user still have guesses left over?
                  if ( guesses_left > 0 ) {
                    return 'incorrect-guess';
                  } else {
                    User.update(user, { state: 'lost' });
                    // does the game have ANY players with guesses left?
                    return Game.getGuessesLeft(game).then(function(guesses_left) {
                      if ( guesses_left > 0 ) {
                        return 'incorrect-out-of-guesses';
                      } else {
                        // start a new round
                        return 'round-over';
                      }
                    });
                  }
                }).then(function(key) {
                  var message = {
                    key: key
                  };

                  game.players.map(function(player) {
                    messages.push(_.assign({ user: player }, message));
                  });

                  if ( key === 'round-over' ) {
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

                      round.game.players.map(function(player) {
                        if ( player.id !== round.submitter.id ) {
                          messages.push(_.assign( { user: player }, nextRoundInstructions));
                        } else {
                          messages.push(_.assign( { user: player }, suggestion));
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
              user.nickname
            ];
            game.players.map(function(player) {
              messages.push(_.assign({ user: player }, message));
            });
            return messages;
          }
        });
      });
    }
  } else {
    return require('../users/say')(user, input);
  }
};

