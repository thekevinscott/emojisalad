var _ = require('lodash');
var setup = require('../lib/setup');

// signup a particular user from scratch
function signup(user) {
  return setup([
    { user: user, msg: 'hi' },
    { user: user, msg: 'Yes' },
    { user: user, msg: user.nickname },
  ]);
}

module.exports = signup;
