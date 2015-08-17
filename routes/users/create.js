var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');

module.exports = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // we support the old, /new route for Website
  // but want to transition to new, /users/create/ POST for new calls
  var passedNumber = req.body.number;
  var platform = req.body.platform;
  if ( ! platform ) {
    platform = 'twilio';
  }
  var entry = 'web';
  if ( req.body.entry ) {
    entry = req.body.entry;
  }
  Phone.parse(passedNumber).then(function(number) {
    return User.create(number, null, entry, platform);
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
