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
var pmx = require('pmx');
var _ = require('lodash');
var router = require('../routes');
var Log = require('../models/log');
var Phone = require('../models/phone');
var User = require('../models/user');
var Message = require('../models/message');
var Twilio = require('../models/twilio');
module.exports = function(req, res) {
  console.log('\n================twilio=================\n');
  res.writeHead(200, {'Content-Type': 'text/xml'});

  console.log('req headers from twilio', req.headers);

  if ( ! req.body.From ) {
    // actually, we don't want to expose anything;
    // this is probably something malicious, it's
    // certainly not a request from Twilio.
    return res.end();
    //var errors = [{ key: 'error-10', message: "You must provide a phone number", type: 'respond' }];
    //return end(errors);
  }

  var body = req.body.Body;
  Log.incoming(req.body, 'twilio');

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
      return user;
    });
  }).then(function(user) {
    if ( ! req.body.Body ) {
      // again, this is almost certainly something malicious.
      // it is technically impossible for Twilio to send us a blank message.
      //errors = [{ key: 'error-11', message: "You must provide a message", type: 'respond', user: user }];
      //return end(errors, user);
      return res.end('');
    } else {
      console.log(req.body.From, '|', req.body.Body, '|', user.state);
      return router(user, body).then(function(response) {
        return end(response, user);
      });
    }
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

    pmx.notify(err);

    res.end();
  });

  function end(response, user) {
    return Message.parse(response).then(function(messages) {
      Log.outgoing(messages, user, 'twilio');
      return Twilio.parse(messages);
    }).then(function(twiml) {
      return res.end(twiml.toString());
    });
  }
}
