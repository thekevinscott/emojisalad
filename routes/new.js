var User = require('../models/user');
var Text = require('../models/text');

module.exports = function(req, res) {
  var number = req.body.number;
  User.create(number).then(function(user) {
    // create a new game
    Text.send(user, 'intro').then(function(response) {
      // this is our first interaction with twilio about this number;
      // it's likely that they've fixed the formatting of our provided
      // number to align with their system. We need those phones to match
      // so lets update our database.
      User.updatePhone(response.to, user.id);
      res.json({});
    }).fail(function(err) {
      res.json(err);
    });

  }).fail(function(err) {
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
