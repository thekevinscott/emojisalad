'use strict';
const Promise = require('bluebird');
const rule = require('config/rule');
const Player = require('models/player');
const User = require('models/user');
const Game = require('models/game');
const Invite = require('models/invite');

module.exports = (user, nickname) => {
  const to = user.to;
  return User.update(user, {
    nickname: nickname,
  }).then((user) => {
    user.to = to;
    return [{
      key: 'intro_3',
      player: user,
      options: [
        user.nickname,
        user.avatar
      ]
    }];
  });
};

