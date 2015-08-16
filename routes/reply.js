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
var User = require('../models/user');
var Message = require('../models/message');
var Text = require('../models/text');
var regex = require('../config/regex');
module.exports = function(req, res) {
  var body = req.body.Body;
  var number = req.body.From;

  Text.saveResponse(req.body);
  // body can match a number of predetermined messages
  if ( regex('invite').test(body) ) {
    var invitingUserNumber = number;
    var invitedUserNumber = body;

    // Check that the user has completed the onboarding flow
    User.onboarded(invitingUserNumber).then(function(onboarded) {
      if ( onboarded ) {
        console.log('inviting user has been onboarded, proceed');
        User.invite(invitedUserNumber, invitingUserNumber).then(function(users) {
          var invitingUser = users.invitingUser;
          var invitedUser = users.invitedUser;
          // success!
          //console.log('user invited, let them know', invitingUser.number);
          Text.send(number, 'intro_4', [ invitedUser.number ]);
          console.log('invitingUser', invitingUser);
          console.log('invitedUser', invitedUser);
          // NEXT STEP: CREATE GAME
          Game.create([
            invitingUser,
            invitedUser
          ]);
        }).fail(function(err) {
          console.log('error inviting user, message: ', body, 'from:', number, 'err:', err);
          if ( typeof err === 'object' && err.key ) {
            Text.send(number, err.key, err.data);
          } else {
            Text.send(number, 'invite_error', [ err ]);
          }
        });
      } else {
        // The user has not completed onboarding
        Text.send(number, 'intro_error', [ 'Plese respond to my previous text MESSAGE >:( (fix this later -ed)' ]);
      }
    }).fail(function(err) {
      console.error('wtf error when checking user onboarded status', err);
    });
  } else {
    // we look at the from message, and see in the database
    // what message you were last sent

    User.lastStep(number, ['intro_error']).then(function(message_key) {
      console.log('last step was', message_key);
      switch(message_key) {
        case 'intro' :
          if ( /^yes$|^yeah|^yea|^y/i.test(body) ) {
          console.log('send step 2');
          Text.send(number, 'intro_2');
        }
        break;
        // if any other response, dont do anything
        case 'intro_2' :
          console.log('heres intro 2');
        // we get their nickname here
        User.updateNickname(body, number).then(function() {
          console.log('send step 3');
          Text.send(number, 'intro_3', [body]);
        });
        break;
        default:
          console.log('message key', message_key);
        break;
      }
    });
  }
}
