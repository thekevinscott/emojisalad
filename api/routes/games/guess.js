var User = require('../../models/user');
//var Message = require('../../models/message');
var Game = require('../../models/game');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  var promises = [];

  if ( /^invite(.*)/i.test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( /^guess(.*)/i.test(input) ) {
    return Game.get({ user: user }).then(function(game) {
      //return Promise.join(
        //Message.get('says', [user.nickname, input]),
        //function(says) {
          //var promises = [];
          //says.type = 'sms';
          var messages = game.players.map(function(player) {
            if ( player.id !== user.id ) {
              return {
                key: 'says',
                type: 'sms',
                user: player,
                options: [
                  user.nickname,
                  input
                ]
              };
              //messages.push(_.assign({}, says, { number: player.number }));
            }
          }).filter(function(el) { return el; });
          //return messages;
        //}
      //).then(function(messages) {
        //return Promise.join(
          //Message.get('incorrect-guess', []),
          //Message.get('correct-guess', [user.nickname]),
          //function(incorrect, correct) {
          var incorrect = {
            key: 'incorrect-guess'
          };
          var correct ={
            key: 'correct-guess',
            options: user.nickname
          }
            var guess = input.split('guess').pop().trim();
            return Game.checkGuess(game, user, guess).then(function(result) {
              console.log('the guess was', result);
              if ( result ) {

                correct.type = 'sms';
                game.players.map(function(player) {
                  messages.push(_.assign({ number: player.number }, correct));
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

                  //return Promise.join(
                    //Message.get('game-next-round-suggestion', [round.submitter.nickname, round.phrase]),
                    //Message.get('game-next-round', [round.submitter.nickname]),
                    //function(suggestion, nextRoundInstructions) {
                  var suggestion = {
                    type: 'sms',
                    key: 'game-next-round-suggestion',
                    options: [
                      round.submitter.nickname,
                      round.phrase
                    ]
                  };

                  var nextRoundInstructions = {
                    type: 'sms',
                    key: 'game-next-round',
                    options: [
                      round.submitter.nickname,
                    ]
                  };
                      //suggestion.type = 'sms';
                      //nextRoundInstructions.type = 'sms';

                      suggestion.user = round.submitter;
                      //suggestion.number = round.submitter.number;
                      messages.push(suggestion);
                      round.game.players.map(function(player) {
                        if ( player.id !== round.submitter.id ) {
                          messages.push(_.assign( { user: player }, nextRoundInstructions));
                        }
                      });
                      return '';
                    //}
                  //);
                      
                  // I DONT THINK THIS DOES ANYTHING
                  //return Message.get('game-start', [game.round.submitter.nickname, game.round.phrase]).then(function(gameStart) {
                    //gameStart.type = 'sms';
                    //gameStart.number = game.round.submitter.number;
                    //return [
                      //invitedMessage,
                      //inviterMessage,
                      //gameStart 
                    //];
                  //});
                }));
              } else {
                incorrect.type = 'sms';
                game.players.map(function(player) {
                  messages.push(_.assign({ user: player },incorrect));
                });
              }

              return Promise.all(promises).then(function() {
                return messages;
              });
            });
          //}
        //);
      //});
    });
  } else {
    return require('../users/say')(user, input);
  }
}

