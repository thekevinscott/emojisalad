var User = require('../models/user');
var Text = require('../models/text');

module.exports = function(req, res) {
  var number = req.body.number;
  User.create(number).then(function(user) {
    // create a new game
    return Text.send(user, 'intro');
  }).then(function(response) {
    res.json({});
  }).fail(function(err) {
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
