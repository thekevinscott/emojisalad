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
  respond: function(responses) {
    if ( responses && responses.length ) {
      var messages = {};
      var options = {};
      console.log('incoming responses', responses);
      responses.map(function(response) {
        if ( response.options ) {
          options[response.key] = response.options;
        }
      });

      return Message.get(responses.map(function(response) {
        if ( ! response.key ) {
          throw new Error("Every response must have a key: " + JSON.stringify(response));
        }
        return response.key;
      }), options, 1).then(function(rows) {
        return rows.map(function(row) {
          //var key = row.key;
          //if ( ! messages[key] ) { messages[key] = {}; }
          messages[row.key] = row.message;
        });
      }).then(function() {
        console.log('all messages', messages);
        var twiml = new twilio.TwimlResponse();
        responses.map(function(response) {
          switch(response.type) {
            case 'sms' :
              if ( response.user ) {
                var number = response.user.number
              } else {
                console.log('##### deprecate passing number directly');
                var number = response.number;
              }

              console.log('sms response', response, messages[response.key]);

              twiml.sms(messages[response.key], {
                to: number,
                from: config.from
              });
            break;
            case 'respond' :
              twiml.message(messages[response.key]);
            break;
            default:
              console.error('uncaught response type', response);
            break;
          }
        });
        console.log('return twiml', twiml.toString());
        return twiml;
      });
    } else {
      return new twilio.TwimlResponse();
    }
  },
}

module.exports = Twilio;

