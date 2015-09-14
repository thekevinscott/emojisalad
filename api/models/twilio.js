'use strict';
const twilio = require('twilio');
module.exports = {
  parse: function(responses) {
    var twiml = new twilio.TwimlResponse();
    responses.map(function(response) {
      twiml.sms(response.message, {
        to: response.to,
        from: response.from
      });
    });
    return new Promise(function(resolve) {
      resolve(twiml);
    });
  },
};
