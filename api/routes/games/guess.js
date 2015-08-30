var User = require('../../models/user');
var Message = require('../../models/message');
var Game = require('../../models/game');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  var promises = [];

  if ( /^guess(.*)/.test(input) ) {
    input = input.split('guess').pop().trim();
    return Promise.join(
      Game.get({ user: user }),
      Message.get('says', [user.nickname, input]),
      Message.get('incorrect-guess', []),
      Message.get('correct-guess', [user.nickname]),
      function(game, message, incorrect, correct) {
        var promises = [];
        var messages = [];
        message.type = 'sms';
        game.players.map(function(player) {
          if ( player.id !== user.id ) {
            messages.push(_.assign({}, message, { number: player.number }));
          }
        });

        return Game.checkGuess(game, user, input).then(function(result) {
          console.log('guess result?', result);
          if ( result ) {

            correct.type = 'sms';
            game.players.map(function(player) {
              messages.push(_.assign({}, correct, { number: player.number }));
            });

            promises.push(Game.newRound(game).then(function(round) {

              //console.log('round', round);

              round.players.map(function(player) {
                //console.log('user', player.id, 'waiting-for-round');
                User.update(player, {
                  state: 'waiting-for-round',
                });
              });
              User.update(round.submitter, {
                state: 'waiting-for-submission',
              });
              //console.log('user', round.submitter.id, 'waiting-for-submission');
              
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
  } else {
    return Promise.join(
      Message.get('says', [user.nickname, input]),
      Game.get({ user: user }),
      function(message, game) {
        message.type = 'sms';
        var messages = [];
        game.players.map(function(player) {
          if ( player.id !== user.id ) {
            message.number = player.number;
            messages.push(message);
          }
        });
        return messages;
      }
    );
  }
}

