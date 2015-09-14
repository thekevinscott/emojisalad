'use strict';
var User = require('../../models/user');
//var Message = require('../../models/message');
var Promise = require('bluebird');

module.exports = function(user) {
  return Promise.join(
    User.create({ number: user.number }),
    function(user) {
      return [{
        key: 'intro',
        user: user
      }];
    }
  );
};
