'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
const _ = require('lodash');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (user, input, to) {
  if ( rule('yes').test(input) ) {
    //let inviter = yield Invite.getInviter(player);
    //if ( inviter ) {
      //let invite = yield Invite.getInvite(player);
      //yield Invite.use(invite);
    //}

    let player = _.extend(user, { to: to });
    return [{
      key: 'intro_2',
      player: player
    }];
  } else if ( rule('no').test(input) ) {
    return yield User.update({ id: player.user_id }, {
      blacklist: 1
    });
  } else {
    return [{
      key: 'onboarding_wtf',
      player: player
    }];
  }
});
