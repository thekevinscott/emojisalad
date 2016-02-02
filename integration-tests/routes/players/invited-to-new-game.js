'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
//const User = require('models/user');
const rule = require('config/rule');
const kickoffGame = require('../shared/kickoffGame');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (player, input, game_number) {
  if ( rule('yes').test(input) ) {
    player.inviter = yield Invite.getInviter(player);
    if ( ! player.inviter ) {
      console.error(player, input);
      throw "There must be an inviter to get to this point";
    }

    let invite = yield Invite.getInvite(player);
    yield Invite.use(invite);

    return yield kickoffGame(player, input, game_number);

  } else {
    throw "WHAT HAPPENS HERE WHEN A USER REJECTS?";
    //return yield User.update({ id: player.user.id }, {
      //blacklist: 1
    //});
  }
});
