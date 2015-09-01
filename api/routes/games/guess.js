var User = require('../../models/user');
var Message = require('../../models/message');
var Game = require('../../models/game');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  var promises = [];

  if ( /^guess(.*)/i.test(input) ) {
    return Game.get({ user: user }).then(function(game) {
      return Promise.join(
        Message.get('says', [user.nickname, input]),
        function(says) {
          var promises = [];
          var messages = [];
          says.type = 'sms';
          game.players.map(function(player) {
            if ( player.id !== user.id ) {
              messages.push(_.assign({}, says, { number: player.number }));
            }
          });
          return messages;
        }
      ).then(function(messages) {
        return Promise.join(
          Message.get('incorrect-guess', []),
          Message.get('correct-guess', [user.nickname]),
          function(incorrect, correct) {
            var guess = input.split('guess').pop().trim();
            return Game.checkGuess(game, user, guess).then(function(result) {
              console.log('the guess was', result);
              if ( result ) {

                correct.type = 'sms';
                game.players.map(function(player) {
                  messages.push(_.assign({}, correct, { number: player.number }));
                });

                promises.push(Game.newRound(game).then(function(round) {


                  round.players.map(function(player) {
                    console.log('player', player.id, 'waiting-for-round update');
                    User.update(player, {
                      state: 'waiting-for-round',
                    });
                  });
                  console.log('player', round.submitter.id, 'waiting-for-submission update');
                  User.update(round.submitter, {
                    state: 'waiting-for-submission',
                  });

                  return Promise.join(
                    Message.get('game-next-round-suggestion', [round.submitter.nickname, round.phrase]),
                    Message.get('game-next-round', [round.submitter.nickname]),
                    function(suggestion, nextRoundInstructions) {
                      suggestion.type = 'sms';
                      nextRoundInstructions.type = 'sms';

                      suggestion.number = round.submitter.number;
                      messages.push(suggestion);
                      round.game.players.map(function(player) {
                        if ( player.id !== round.submitter.id ) {
                          messages.push(_.assign({}, nextRoundInstructions, { number: player.number }));
                        }
                      });
                      return '';
                    }
                  );
                  return Message.get('game-start', [game.round.submitter.nickname, game.round.phrase]).then(function(gameStart) {
                    gameStart.type = 'sms';
                    gameStart.number = game.round.submitter.number;
                    return [
                      invitedMessage,
                      inviterMessage,
                      gameStart 
                    ];
                  });
                }));
              } else {
                incorrect.type = 'sms';
                game.players.map(function(player) {
                  messages.push(_.assign({}, incorrect, { number: player.number }));
                });
              }

              return Promise.all(promises).then(function() {
                return messages;
              });
            });
          }
        );
      });
    });
  } else {
    return Promise.join(
      Message.get('says', [user.nickname, input]),
      Game.get({ user: user }),
      function(says, game) {
        says.type = 'sms';
        var messages = [];
        game.players.map(function(player) {
          if ( player.id !== user.id ) {
            messages.push(_.assign({}, says, { number: player.number }));
          }
        });
        return messages;
      }
    );
  }
}

