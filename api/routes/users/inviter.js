var User = require('../../models/user');
var Game = require('../../models/game');
var Invite = require('../../models/invite');

module.exports = function(req, res) {
  var user_id = req.params.user_id;
  Invite.getInviter(user_id).then(function(inviter) {
    if ( inviter ) {
      res.json(inviter);
    } else {
      res.json({});
    }
  });
}
