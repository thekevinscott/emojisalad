/*
 * An incoming message from Messenger will contain the following:
 *
 *
 * username: 'foo'
 * body: 'yes'
 */
var rp = require('request-promise');
var script = require('../scripts');
var Log = require('../models/log');
var User = require('../models/user');
var Message = require('../models/message');
module.exports = function(req, res) {
  //Log.incoming(req.body);

  var body = req.body.message;
  var username = req.body.username;
  var platform = 'messenger';
  var entry = 'messenger';

  if ( ! username ) {
    return res.json({ error: "You must provide a username" });
  } else if ( ! body ) {
    return res.json({ error: "You must provide a message" });
  }

  User.get({ username: username }).then(function(user) {
    console.log('back from user')
    if ( user ) {
      console.log('got user', user);
      return script(user.state, user, body).then(function(response) {
        var message;
        response.map(function(r) {
          if ( typeof r === 'string' ) {
            message = r;
          }
        });
        console.log('response', message);
        res.json({
          message: message
        });
      });
    } else {
      console.log('user does not exist');
      // user does not yet exist; create the user
      return User.create({ 'messenger-name': username }, entry, platform).then(function() {
        return Message.get('intro');
      });
    }
  }).then(function(response) {
    res.json(response);
  }).fail(function(err) {
    console.error('some odd kind of messenger error', err);
  });
}
