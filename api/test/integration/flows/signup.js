'use strict';
const _ = require('lodash');
const setup = require('../lib/setup');

// signup a particular player from scratch
function signup(player) {
  return setup([
    { player: player, msg: 'hi' },
    { player: player, msg: 'Yes' },
    { player: player, msg: player.nickname },
  ]);
}

module.exports = signup;
