'use strict';
const setup = require('../lib/setup');

// invite a particular player and have them sign up
function invite(inviter, invited) {
  return setup([
    { player: inviter, msg: 'invite '+invited.number},
  ]).then(function(response) {
    let numbers = response[0].Response.Sms[0].$;
    invited.to = numbers.from;
    return setup([
      { player: invited, msg: 'yes'},
      { player: invited, msg: invited.nickname},
    ]);
  });
}

module.exports = invite;
