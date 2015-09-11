var User = require('../../models/user');
//var Message = require('../../models/message');
var Game = require('../../models/game');
var Round = require('../../models/round');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  var promises = [];

  if ( /^invite(.*)/i.test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( /^clue(.*)/i.test(input) ) {
    return require('../games/clue')(user, input);
  } else if ( /^guess(.*)/i.test(input) ) {
    return Game.get({ user: user }).then(function(game) {
      var messages = game.players.map(function(player) {
        if ( player.id !== user.id ) {
          return {
            key: 'says',
            user: player,
            options: [
              user.nickname,
              input
            ]
          };
        }
      }).filter(function(el) { return el; });

      return Round.getGuessesLeft(game, user).then(function(guesses_left) {
        if ( guesses_left > 0 ) {

          var guess = input.match(/guess(.*)/i).pop().trim();
          return Game.checkGuess(game, user, guess).then(function(result) {
            if ( result ) {
              var correct ={
                key: 'correct-guess',
                options: user.nickname
              }

              game.players.map(function(player) {
                messages.push(_.assign({ user: player }, correct));
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
                messages.push(suggestion);
                round.game.players.map(function(player) {
                  if ( player.id !== round.submitter.id ) {
                    messages.push(_.assign( { user: player }, nextRoundInstructions));
                  }
                });
              }));
              return Promise.all(promises).then(function() {
                return messages;
              });
            } else {
              // we do a request to get the up-to-date
              // guesses, after setting it earlier
              return Round.getGuessesLeft(game, user).then(function(guesses_left) {
                // does the user still have guesses left over?
                if ( guesses_left > 0 ) {
                  return 'incorrect-guess';
                } else {
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
                    messages.push(suggestion);
                    round.game.players.map(function(player) {
                      if ( player.id !== round.submitter.id ) {
                        messages.push(_.assign( { user: player }, nextRoundInstructions));
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
  } else {
    return require('../users/say')(user, input);
  }
}

