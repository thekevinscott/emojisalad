'use strict';
const config = require('config/twilio');
const Promise = require('bluebird');
const twilio = require('twilio');
const client = twilio(config.accountSid, config.authToken);
const sendMessage = Promise.promisify(client.sendMessage);
const phone = require('lib/phone');

const sms = Promise.coroutine(function* (params) {
  const twiml = new twilio.TwimlResponse();
  let newParams = {};
  if ( params ) {
    if ( ! params.body ) {
      throw new Error("You must provide params body");
    }
    if ( ! params.from ) {
      throw new Error("You must provide params from");
    }
    if ( ! params.to ) {
      throw new Error("You must provide params to");
    }
    const to = yield validNumber(params.to);
    const from = yield validNumber(params.from);
    newParams = {
      to,
      from,
      body: params.body
    };
    const result = yield sendMessage(newParams);
    if ( result.status === 'queued' ) {
      return {
        status: 2
      };
    } else {
      return {
        status: 3
      };
    }
  } else {
    return {};
  }
});

module.exports = sms;

const validNumber = Promise.coroutine(function* (number) {
  const lng = number.replace(/\+/,'').length;
  if ( lng === 11 || lng === 10 ) {
    // this is a valid number we can handle.
    if ( number.length === 12 && number[0] === '+' ) {
      // totally legit number
      return number;
    } else if ( number.length === 11 ) {
      if ( number[0] === '+' ) {
        // only US numbers supported for now
        return '+1' + number.substring(1);
      } else {
        return '+' + number;
      }
    } else if ( number.length === 10 && number[0] !== '+' ) {
      // only US numbers supported for now
      return '+1' + number;
    }
  }

  return yield phone(number);
});
