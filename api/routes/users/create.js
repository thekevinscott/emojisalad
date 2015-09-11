var User = require('../../models/user');
//var Message = require('../../models/message');
var Promise = require('bluebird');

module.exports = function(user, message) {
  return Promise.join(
    User.create({ number: user.number }),
    function(user, message) {
      return [{
        key: 'intro',
        user: user
      }];
    }
  );
}
