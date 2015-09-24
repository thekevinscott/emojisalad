'use strict';
//var Promise = require('bluebird');
var User = require('models/user');
//var Message = require('../../models/message');

module.exports = function(user) {
  return User.create({ number: user.number }).then(function(user) {
    return [{
      key: 'intro',
      user: user
    }];
  });
};
