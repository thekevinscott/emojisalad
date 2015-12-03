'use strict';
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
const pmx = require('pmx');
const router = require('routes');
//const _ = require('lodash');
const Log = require('models/log');
const Phone = require('models/phone');
const Player = require('models/player');
const User = require('models/user');
const Message = require('models/message');
const Twilio = require('models/twilio');
const track = require('tracking');
const debug = false;
module.exports = function(req, res) {
  if ( debug ) {
    console.log('\n================twilio=================\n');
    console.log(req.body.From, req.body.Body, req.body.To);
    //console.log('req headers from twilio', req.headers.host);
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});


  if ( ! req.body.From ) {
    // actually, we don't want to expose anything;
    // this is probably something malicious, it's
    // certainly not a request from Twilio.
    return res.end();
    //var errors = [{ key: 'error-10', message: "You must provide a phone number", type: 'respond' }];
    //return end(errors);
  }

  const body = req.body.Body;
  Log.incoming(req.body);

  // first, we parse the Phone number
  Phone.parse([req.body.From, req.body.To]).then(function(parsed_numbers) {
    const from = parsed_numbers[0];
    const to = parsed_numbers[1];
    return Player.get({ from: from, to: to }).then(function(player) {
      if ( !player ) {
        // does a user exist?
        return User.get({ from: from }).then(function(user) {
          if ( user ) {
            return {
              state: 'uncreated',
              user_id: user.id,
              to: to,
              //number: user.from,
              user: user
            };
          } else {
            return {
              number: from,
              state: 'uncreated',
            };
          }
        });
      } else {
        return player;
      }
    });
  }).then(function(player) {
    if ( ! req.body.Body ) {
      // again, this is almost certainly something malicious.
      // it is technically impossible for Twilio to send us a blank message.
      //errors = [{ key: 'error-11', message: "You must provide a message", type: 'respond', player: player }];
      //return end(errors, player);
      return res.end('');
    } else {
      if ( debug ) {
        console.log([
          player.id,
          player.nickname,
          req.body.From,
          req.body.Body,
          player.state,
        ].join(' | '));
      }
      if ( !req.body.To || req.body.To[0] !== '+' ) {
        console.error('to', req.body.To);
        throw "STOP";
      }
      try {
        track(player.state, player, req.body.Body);
      } catch(e) {
        console.error('error tracking player', player, req);
      }
      return router(player, body, req.body.To, debug).then(function(response) {
        return end(response);
      });
    }
  }).catch(function(err) {
    // this should not notify the player. It means that the incoming request's number
    // somehow failed validation on Twilio's side, which would be odd because Twilio
    // is providing us with that number.
    //
    // This could mean Twilio somehow fell down between requests, or there's a man
    // in the middle, or someone has gotten a hold of this URL and is trying to hack us.
    console.error('twilio error for ', req.body);
    console.error(err.stack);
    if ( err.sql ) {
      console.error(err.sql);
    }
    console.error(err);

    pmx.notify(err);

    res.end();
  });

  function end(response) {
    return Message.parse(response).then(function(messages) {
      if ( process.env.ENVIRONMENT === 'test' ) {
        // this returns twiml
        return Twilio.parse(messages);
      } else {
        // this actually sends out sms
        return Twilio.send(messages);
      }
    }).then(function(twiml) {
      return res.end(twiml.toString());
    });
  }
};
