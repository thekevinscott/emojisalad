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
var Game = require('../models/game');
var Text = require('../models/text');
var Log = require('../models/log');
var Phone = require('../models/phone');
var regex = require('../config/regex');
module.exports = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log('reply');

  Log.incoming(req.body);

  var body = req.body.Body;
  var number = req.body.From;
  // body can match a number of predetermined messages
  if ( regex('invite').test(body) ) {
    console.log('do we invite? yes we do');
    var invitingUserNumber = number;
    var invitedUserNumber = body;

    // Check that the user has completed the onboarding flow
    User.onboarded(invitingUserNumber).then(function(response) {
      if ( response ) {
        console.log('parse the phone number', invitedUserNumber);
        return Phone.parse(invitedUserNumber);
      } else {
        // The user has not completed onboarding
        Text.send(number, 'not_yet_onboarded_error', [ response.last_step ]);
        return Q.reject('user has not completed onboarding');
      }
    }).then(function(invitingUserNumberParsed) {
        console.log('inviting user has been onboarded, proceed', invitingUserNumberParsed);
        User.invite(invitedUserNumber, invitingUserNumberParsed).then(function(users) {
          console.log('invited the user');
          var invitingUser = users.invitingUser;
          var invitedUser = users.invitedUser;
          // let the user who invited this new user know they signed up
          User.notifyInviter(invitedUser);
          // success!
          console.log('post sending text');
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
    }).fail(function(err) {
      console.error('wtf error when checking user onboarded status', err);
    });
  } else {
    // we look at the from message, and see in the database
    // what message you were last sent

    var weDontCareAboutTheseSteps = [
      'intro_error',
      'not_yet_onboarded_error'
    ];
    User.lastStep(number, weDontCareAboutTheseSteps).then(function(message_key) {
      console.log('last step was', message_key);
      switch(message_key) {
        case 'intro' :
          if ( /^yes$|^yeah|^yea|^y/i.test(body) ) {
          console.log('send step 2', number);
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
          User.updateState('onboarded', number);
        });
        break;
        case 'invite' :
          if ( /^yes$|^yeah|^yea|^y/i.test(body) ) {
            
            console.log('send invite step 2', number);
            Text.send(number, 'invite_2');
          }
        break;
        case 'invite_2' :
          console.log('heres invite 2');
          var nickname = body;
          console.log('upadte invited nick', nickname, number);
          User.updateNickname(nickname, number).then(function() {
            console.log('upadte invited state');
            User.updateState('onboarded', number);
            console.log('let inviter know');
            User.get(number).then(function(users) {
              if ( users.length ) {
                var user = users[0];
                console.log('user inviter', user, nickname);
                // let the person who invited Ari know he joined
                Text.send({
                  id: user.inviter_id,
                  number: user.inviter_number
                }, 'accepted', [ nickname ]);
                Game.update(user.inviter_id);
              } else {
                throw "wtf this should not happen, the inviter id returns a null user" + user.inviter_id;
              }
            });

          });
        break;
        default:
          console.log('message key', message_key);
        break;
      }
    });
  }
}
