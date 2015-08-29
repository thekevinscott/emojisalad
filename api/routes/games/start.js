var User = require('../../models/user');
var Message = require('../../models/message');

module.exports = function(user, input) {
  if ( /^yes|^yeah|^yea|^y$/.test(input) ) {
    return Message.get('intro_2').then(function(message) {
      message.type = 'respond';
      User.update(user, {
        state: 'waiting-for-nickname'
      });
      return [message];
    });
  } else {
    User.update(user, {
      state: 'do-not-contact'
    });
  }

}

