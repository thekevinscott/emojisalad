'use strict';
//const Promise = require('bluebird');
const Phrase = require('models/phrase');
const User = require('models/user');
const Game = require('models/game');

const userIsCorrect = (user) => {
  if (user.id) {
    return Game.create([user]).then((game) => {
      console.info('created game', game);
      const new_player = game.players.filter((game_player) => {
        return game_player.user_id === user.id;
      }).pop();
      console.info('new player', new_player);

      return [{
        player: new_player,
        key: 'challenge_correct_new_game',
        options: [
          new_player.nickname,
          new_player.avatar
        ]
      }];
    });
  } else {
    console.log('user does not has an id');
    return User.create({
      from: user.from,
      protocol: user.protocol,
      confirmed: 1,
    }).then(createdUser => {
      if ( createdUser.error ) {
        console.error('Error creating user', createdUser);
        throw new Error('Error creating user');
      } else {
        return [{
          player: user,
          key: 'challenge_is_correct',
          protocol: user.protocol,
        }];

      }
    });
  }
};

module.exports = ({
  user,
  message,
  phrase,
}) => {
  return Phrase.guess({
    guess: message,
    phrase: phrase.phrase,
  }).then((response) => {
    if (response.result === 1) {
      return userIsCorrect(user);
    }

    //console.log('return challenge is incorrect');
    return [{
      player: user,
      key: 'challenge_is_incorrect',
      protocol: user.protocol,
    }];
  });
};
