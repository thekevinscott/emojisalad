var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');
var Invite = require('../../models/invite');

module.exports = function(req, res) {
  var user = req.body.user;
  var type = req.body.type; // for instance, a phone
  var value = req.body.value;
  if ( ! user ) {
    res.json({ error: 'You must provide a user' });
  } else if ( ! type ) {
    res.json({ error: 'You must provide a type' });
  } else if ( ! value ) {
    res.json({ error: 'You must provide a value' });
  }
  console.log('user who is requesting to invite somebody', user);

  Invite.create(type, value, user).then(function(response) {
    res.json({});
  }).fail(function(err) {
    console.log('error inviting user', err);
    res.json({ error: err });
  });
};
