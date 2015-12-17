'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (player, input) {
  if ( rule('yes').test(input) ) {
    let inviter = yield Invite.getInviter(player);
    if ( inviter ) {
      let invite = yield Invite.getInvite(player);
      yield Invite.use(invite);
    }

    yield Player.update(player, {
      state: 'waiting-for-nickname'
    });
    return [{
      key: 'intro_2',
      player: player
    }];
  } else if ( rule('no').test(input) ) {
    return yield User.update({ id: player.user.id }, {
      blacklist: 1
    });
  } else {
    return [{
      key: 'onboarding_wtf',
      player: player
    }];
  }
});
