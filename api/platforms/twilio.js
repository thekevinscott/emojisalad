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
var _ = require('lodash');
var router = require('../routes');
var Log = require('../models/log');
var Phone = require('../models/phone');
var User = require('../models/user');
var Message = require('../models/message');
var Text = require('../models/text');
module.exports = function(req, res) {
  console.log('\n====================================\n');
  res.writeHead(200, {'Content-Type': 'text/xml'});

  if ( ! req.body.From ) {
    return res.end(Text.respond([{ message: "You must provide a phone number", type: 'respond' }]).toString());
  } else if ( ! req.body.Body ) {
    return res.end(Text.respond([{ message: "You must provide a message", type: 'respond' }]).toString());
  }

  var body = req.body.Body;
  //Log.incoming(req.body);

  var number;
  var platform = 'twilio';
  var entry = 'text';

  // first, we parse the Phone number
  Phone.parse(req.body.From).then(function(parsedNumber) {
    number = parsedNumber;
    return User.get({ number: number }).then(function(user) {
      if ( !user ) {
        user = {
          number: number,
          state: 'uncreated',
          entry: entry,
          platform: platform
        }
      }
      console.log(req.body.From, '|', req.body.Body, '|', user.state);
      return router(user, body);
    });
  }).then(function(response) {
    return Text.respond(response).toString();
  }).then(function(response) {
    return res.end(response);
  }).catch(function(err) {
    // this should not notify the user. It means that the incoming request's number
    // somehow failed validation on Twilio's side, which would be odd because Twilio
    // is providing us with that number.
    //
    // This could mean Twilio somehow fell down between requests, or there's a man
    // in the middle, or someone has gotten a hold of this URL and is trying to hack us.
    console.error('twilio error for number', number);
    console.error(err.stack);
    if ( err.sql ) {
      console.error(err.sql);
    }
    res.end();
  });
}
