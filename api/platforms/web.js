/*
 * An incoming POST from the website will contain the following:
 *
 * number: (860) 460-8183
 *
 */
var User = require('../models/user');
var Phone = require('../models/phone');
var Text = require('../models/text');
var Message = require('../models/message');

module.exports = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var platform = 'twilio';
  var entry = 'web';

  if ( !req.body.number ) {
    return res.json({ error: 'You must provide a valid number' });
  }

  var user;
  Phone.parse(req.body.number).then(function(number) {
    return User.create({ number: number }, entry, platform);
  }).then(function(newUser) {
    user = newUser;

    return Message.get('intro');
  }).then(function(message) {
    return Text.send(user, message);
  }).then(function() {
    res.json({});
  }).fail(function(err) {
    console.log('error creating user / sending text', err);
    if ( err.message ) {
      // possible error - number is already registered.
      res.json({ error: err.message });
    }
  });
}
