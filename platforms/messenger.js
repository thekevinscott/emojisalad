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
module.exports = function(req, res) {
  console.log('messenger reply');

  //Log.incoming(req.body);

  var body = req.body.message;
  var username = req.body.username;

  User.getSingle({ username: username }).then(function(user) {
    if ( user ) {
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
      return rp({
        url: 'http://localhost:5000/users/create',
        method: 'POST',
        json: {
          username: username,
          entry: 'IM',
          platform: 'messenger'
        }
      });
    }
  }).fail(function(err) {
    // this should not notify the user. It means that the incoming request's number
    // somehow failed validation on Twilio's side, which would be odd because Twilio
    // is providing us with that number.
    //
    // This could mean Twilio somehow fell down between requests, or there's a man
    // in the middle, or someone has gotten a hold of this URL and is trying to hack us.
    console.error('some odd kind of twilio error', err);
  });
}
