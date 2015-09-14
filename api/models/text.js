'use strict';
//var client = require('twilio')(config.accountSid, config.authToken); 
const config = require('config/twilio');
const Message = require('./message');
const twilio = require('twilio');

module.exports = {
  respond: function(responses) {
    if ( responses && responses.length ) {
      var messages = {};
      var options = {};
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
        var twiml = new twilio.TwimlResponse();
        responses.map(function(response) {
          switch(response.type) {
            case 'sms' :
              let number = response.user.number;

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
        return twiml;
      });
    } else {
      return new twilio.TwimlResponse();
    }
  },
};
