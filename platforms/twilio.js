/*
 * An incoming text from Twilio will contain the following:
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
var Message = require('../models/message');
var Text = require('../models/text');
module.exports = function(req, res) {
  console.log('reply');

  Log.incoming(req.body);

  var body = req.body.Body;
  var number;
  var platform = 'twilio';
  var entry = 'text';

  // first, we parse the Phone number
  Phone.parse(req.body.From).then(function(parsedNumber) {
    number = parsedNumber;
    console.log('parsed the number', number);
    return User.get({ number: number });
  }).then(function(user) {
    console.log('back from user get single');
    if ( user ) {
      console.log('user exists, proceed', user);
      return script(user.state, user, body);
    } else {
      console.log('user does not exist');
      return User.create({ number: number }, entry, platform).then(function() {
        return Message.get('intro');
      });
    }
  }).then(function(response) {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(Text.reply(response).toString());
      //return rp({
        //url: 'http://localhost:5000/users/create',
        //method: 'POST',
        //json: {
          //number: number,
          //entry: 'text',
          //platform: 'twilio'
        //}
      //});
    //}
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
