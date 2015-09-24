'use strict';
const twilio = require('twilio');
const config = require('../config/twilio')[process.env.ENVIRONMENT];
const Promise = require('bluebird');
const client = twilio(config.accountSid, config.authToken);
const send = Promise.promisify(client.sendMessage);

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
  send: function(responses) {
    let message_time = 0;
    return Promise.reduce(responses, function(output, response) {
      // add 1000 to the sending time. Twilio limits
      // outgoing messages to 1 per second anyways,
      // so we can't actually do anything faster than this.
      return Promise.delay(message_time + 1000).then(function() {
        return send({
          to: response.to,
          from: response.from,
          body: response.message
        });
      }).then(function(send_output) {
        return output.concat(send_output);
      });
    }, []);
  }
};
