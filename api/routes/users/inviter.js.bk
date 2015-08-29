var User = require('../../models/user');
var Game = require('../../models/game');
var Invite = require('../../models/invite');

module.exports = function(req, res) {
  var user_id = req.params.user_id;
  console.log('you ready');
  return Invite.getInviter(user_id).then(function(inviter) {
    console.log('got em', inviter);
    if ( inviter ) {
      return Game.getByUsers([inviter]).then(function(game) {
        console.log('got the game');
        inviter.game = game;
        return res.json(inviter);
      });
    } else {
      console.log('nothing back');
      return res.json({});
    }
  });
}
