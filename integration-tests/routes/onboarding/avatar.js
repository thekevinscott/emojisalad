'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const Game = require('models/game');
const Emoji = require('models/emoji');
const rule = require('config/rule');
const kickoffGame = require('../shared/kickoffGame');

module.exports = (user, input) => {
  if ( rule('keep').test(input) ) {
    console.info('keep is matched');
    return User.update(user, {
      confirmed_avatar: 1
    }).then(() => {
      return Game.create([user]);
    }).then(() => {
      return [{
        player: user,
        key: 'intro_4',
        options: [user.nickname, user.avatar]
      }];
    });
    //return startGame(user, input);
  } else {
    console.info('keep is not matched', input);
    return Emoji.checkInput(input).then((result) => {
    //let result = Emoji.checkInput(input);
      console.info('keep result', result);
      if ( result.type === 'emoji' ) {
        if ( result.number === 1 ) {
          // also check length of emoji
          const to = user.to;
          return User.update(user, {
            avatar: input
          }).then((user) => {
            user.to = to;
            console.log('create game');
            return Game.create([user]);
            //return startGame(user, input, user.to);
          }).then(() => {
            console.log('did it');
            return [{
              player: user,
              key: 'intro_4',
              options: [user.nickname, input]
            }];
          });
        } else {
          return [{
            player: user,
            key: 'error-14'
          }];
        }
      } else {
        return [{
          player: user,
          key: 'error-14'
        }];
      }
    });
  }
};
