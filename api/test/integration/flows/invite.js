var _ = require('lodash');
var setup = require('../lib/setup');

// invite a particular user and have them sign up
function invite(inviter, invited) {
  return setup([
    {user: inviter, msg: 'invite '+invited.number},
    {user: invited, msg: 'yes'},
    {user: invited, msg: invited.nickname},
  ]);
}

module.exports = invite;
