'use strict';
var User = require('models/user');
var rule = require('config/rule');
//var Message = require('../../models/message');

module.exports = function(user, input) {
  if ( rule('yes').test(input) ) {
    return User.update(user, {
      state: 'waiting-for-nickname'
    }).then(function() {
      return [{
        key: 'intro_2',
        user: user
      }];
    });
  } else {
    User.update(user, {
      state: 'do-not-contact'
    });
  }
};
