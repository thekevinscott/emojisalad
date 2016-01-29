'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const User = require('models/user');
const _ = require('lodash');

module.exports = (from, input, to) => {
  return User.create({ from: from }).then((user) => {
    let player = _.extend(user, { to: to });
    return [{
      key: 'intro',
      player: player
    }];
  });
};
