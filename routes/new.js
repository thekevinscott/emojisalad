var User = require('../models/user');
var Text = require('../models/text');

module.exports = function(req, res) {
  var number = req.body.number;
  User.create(number).then(function(user) {
    console.log('create a new game');
    // create a new game
    return Text.send(user, 'intro');
  }).then(function(response) {
    res.json({});
  }).fail(function(err) {
    console.log('error creating user / sending text', err);
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
