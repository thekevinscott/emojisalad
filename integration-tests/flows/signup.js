'use strict';
//const _ = require('lodash');
const setup = require('lib/setup');
const rule = require('config/rule');

// signup a particular player from scratch
function signup(player) {
  return setup([
    { player: player, msg: 'hi' },
    { player: player, msg: rule('yes').example() },
    { player: player, msg: player.nickname },
    { player: player, msg: player.avatar },
  ]);
}

module.exports = signup;
