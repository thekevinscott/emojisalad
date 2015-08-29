var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');
var Game = require('../../models/game');
var Invite = require('../../models/invite');

module.exports = function(req, res) {
  var user = req.body.user;
  var type = req.body.type; // for instance, a phone
  var value = req.body.value;
  console.log('get ready to create invite!!!!');
  if ( ! user ) {
    res.json({ error: { message: 'You must provide a user', errno: 9 }});
  } else if ( ! type ) {
    res.json({ error: { message: 'You must provide a type', errno: 9 }});
  } else if ( ! value ) {
    res.json({ error: {message: 'You must provide a value', errno: 8 }});
  }
  console.log('user who is requesting to invite somebody', user, type, value);

  Invite.create(type, value, user).then(function(invite) {
    return {
      invited_user: invite.invited_user,
      inviting_user: invite.inviting_user,
    };
  }).then(function(users) {
    console.log('send users back', users);
    res.json(users);
  }).fail(function(err) {
    console.log('error inviting user', err);
    res.json( err );
  });
};
