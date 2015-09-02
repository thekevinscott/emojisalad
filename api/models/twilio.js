var config = require('../config/twilio');
var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');

var client = require('twilio')(config.accountSid, config.authToken); 
 
var User = require('./user');
var Message = require('./message');

var twilio = require('twilio');
//function get(sid) {
    //if ( sid ) {
        //return client.messages(sid).get();
    //} else {
        //return client.messages.list();
    //}
//}


var Twilio = {
  parse: function(responses) {
    var twiml = new twilio.TwimlResponse();
    responses.map(function(response) {
      switch(response.type) {
        case 'sms' :
          twiml.sms(response.message, {
            to: response.to,
            from: response.from
          });
        break;
        case 'respond' :
          twiml.message(response.message);
        break;
        default:
          console.error('uncaught response type', response);
        break;
      }
    });
    return new Promise(function(resolve) {
      resolve(twiml);
    });
  },
}

module.exports = Twilio;

