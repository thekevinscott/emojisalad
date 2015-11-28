'use strict';
var Invite = require('models/invite');

module.exports = function(req, res) {
  var player = req.body.player;
  var type = req.body.type; // for instance, a phone
  var value = req.body.value;
  if ( ! player ) {
    res.json({ error: { message: 'You must provide a player', errno: 9 }});
  } else if ( ! type ) {
    res.json({ error: { message: 'You must provide a type', errno: 9 }});
  } else if ( ! value ) {
    res.json({ error: {message: 'You must provide a value', errno: 8 }});
  }

  Invite.create(type, value, player).then(function(invite) {
    return {
      invited_player: invite.invited_player,
      inviting_player: invite.inviting_player,
    };
  }).then(function(players) {
    res.json(players);
  }).fail(function(err) {
    console.error('error inviting player', err);
    res.json( err );
  });
};
