'use strict';
const setup = require('lib/setup');
//const rule = require('config/rule');

// invite a particular player and have them sign up
const invite = (inviter, invited, return_last = false, expected_length = 3) => {
  return setup([
    { player: inviter, msg: 'invite '+invited.number }
  ]).then(() => {
    return setup([
      { player: invited, msg: 'yes' },
      { player: invited, msg: invited.nickname },
      { player: invited, msg: invited.avatar, get_response: return_last }
      // pass three elements to match that we expect
      // to find three elements back
    ], expected_length);
  }).then(r => {
    return r;
  });
};

module.exports = invite;
