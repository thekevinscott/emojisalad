'use strict';
//const _ = require('lodash');
const Promise = require('bluebird');
//const Player = require('models/player');
//const Round = require('models/round');
const User = require('models/user');
//const Game = require('models/game');
const Emoji = require('models/emoji');
const rule = require('config/rule');
//const kickoffGame = require('../shared/kickoffGame');

module.exports = (user, input) => {
  console.info('here be the avatar');
  const to = user.to;
  return new Promise((resolve, reject) => {
    if ( rule('keep').test(input) ) {
      resolve(User.update(user, {
        confirmed_avatar: 1
      }));
    } else {
      return Emoji.checkInput(input).then((result) => {
        if ( result.type === 'emoji' && result.number === 1 ) {
          resolve(User.update(user, {
            avatar: input,
            confirmed_avatar: 1
          }));
        } else {
          reject('error-14');
        }
      });
    }
  }).then((updated_user) => {
    console.info('**** START THE GAME');
    return require('../game/start')({
      ...updated_user,
      to
    }, input);
  }).catch((err) => {
    if ( err !== 'error-14' ) {
      console.error('err', err);
    }
    return [{
      player: user,
      key: 'error-14'
    }];
  });
};
