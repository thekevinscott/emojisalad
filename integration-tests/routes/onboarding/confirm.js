'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
const _ = require('lodash');

module.exports = (user, input) => {
  if ( rule('yes').test(input) ) {
    //let inviter = yield Invite.getInviter(player);
    //if ( inviter ) {
    //let invite = yield Invite.getInvite(player);
    //yield Invite.use(invite);
    //}

    return User.update(user, {
      confirmed: 1
    }).then(() => {
      return [{
        key: 'intro_2',
        player: user
      }];
    });
  } else if ( rule('no').test(input) ) {
    return User.update(user, {
      blacklist: 1
    });
  } else {
    return [{
      key: 'onboarding_wtf',
      player: user 
    }];
  }
}
