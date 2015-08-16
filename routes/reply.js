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
var Phone = require('../models/phone');
var Message = require('../models/message');
var Text = require('../models/text');
module.exports = function(req, res) {
  var body = req.body.Body;
  var from = req.body.From;

  // we look at the from message, and see in the database
  // what message you were last sent

  Phone.lastStep(from).then(function(message_key) {
    switch(message_key) {
      case 'intro' :
        if ( /^yes$|^yeah|^yea|^y/i.test(body) ) {
          Text.send(from, 'intro_2');
        }
        break;
        // if any other response, dont do anything
      case 'intro_2' :
        console.log('heres intro 2');
        // we get their nickname here
        Phone.updateNickname(body, from).then(function() {
          Text.send(from, 'intro_3', [body]);
        });
        break;
      case 'intro_3' :
        // now we are inviting other people 
        if ( /^invite /i.test(body) ) {
        }
        break;
      default:
        console.log('message key', message_key);
        break;
    }
  });
}
