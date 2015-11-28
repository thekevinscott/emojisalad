'use strict';
const setup = require('../lib/setup');

// invite a particular player and have them sign up
function invite(inviter, invited) {
  return setup([
    {player: inviter, msg: 'invite '+invited.number},
    {player: invited, msg: 'yes'},
    {player: invited, msg: invited.nickname},
  ]);
}

module.exports = invite;
