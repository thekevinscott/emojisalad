'use strict';
const setup = require('lib/setup');
const rule = require('config/rule');

// invite a particular player and have them sign up
const invite = (inviter, invited, return_last = false) => {
  return setup([
    { player: inviter, msg: 'invite '+invited.number},
  ]).then((response) => {
    //console.log('response', response);
    //invited.to = response.from;
    return setup([
      { player: invited, msg: 'yes' },
      { player: invited, msg: invited.nickname },
      { player: invited, msg: invited.avatar, get_response: return_last },
    ]);
  });
}

module.exports = invite;
