var User = require('../../models/user');
//var Message = require('../../models/message');

module.exports = function(user, input) {
  if ( /^yes|^yeah|^yea|^y$/i.test(input) ) {
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

}
