/*
 * A reply from Twilio will contain the following:
 *
 *
 * ToCountry: 'US',
 * ToState: 'CT',
 * SmsMessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * NumMedia: '0',
 * ToCity: 'GALES FERRY',
 * FromZip: '06357',
 * SmsSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * FromState: 'CT',
 * SmsStatus: 'received',
 * FromCity: 'NEW LONDON',
 * Body: 'yes',
 * FromCountry: 'US',
 * To: '+18603814348',
 * NumSegments: '1',
 * ToZip: '06382',
 * MessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * AccountSid: 'ACf2076b907d44abdd8dc8d262ff941ee4',
 * From: '+18604608183',
 * ApiVersion: '2010-04-01'
 */
var rp = require('request-promise');
var script = require('../scripts');
var Log = require('../models/log');
var Phone = require('../models/phone');
var User = require('../models/user');
module.exports = function(req, res) {
  console.log('reply');

  Log.incoming(req.body);

  var body = req.body.Body;
  var number = req.body.From;

  // first, we parse the Phone number
  Phone.parse(number).then(function(response) {
    return User.getSingle({ number: number });
  }).then(function(user) {
    if ( user ) {
      script(user, body, res);
    } else {
      // user does not yet exist; create the user
      rp({
        url: 'http://localhost:5000/users/create',
        method: 'POST',
        json: {
          number: number,
          entry: 'text',
          platform: 'twilio'
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
    console.error('There was an error parsing phone number', err);
  });
}
