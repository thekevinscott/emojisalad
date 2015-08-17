var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');

module.exports = function(req, res) {
  // we support the old, /new route for Website
  // but want to transition to new, /users/create/:number GET for new calls
  if ( req.method === 'GET' ) {
    var passedNumber = req.params.number;
  } else {
    var passedNumber = req.body.number;
  }
  Phone.parse(passedNumber).then(function(number) {
    return User.create(number, 'web');
  }).then(function(user) {
    return Text.send(user, 'intro');
  }).then(function(response) {
    res.json({});
  }).fail(function(err) {
    console.log('error creating user / sending text', err);
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
