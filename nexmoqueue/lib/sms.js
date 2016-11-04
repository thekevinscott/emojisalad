'use strict';
const Promise = require('bluebird');
const nexmo = require('config/nexmo');
const phone = require('lib/phone');

const sms = Promise.coroutine(function* (params) {
  //return {};
  let newParams = {};
  //console.info('sms 1');
  if ( params ) {
    //console.info('sms 2');
    if ( ! params.body ) {
      console.error('You must provide params body', params);
      throw new Error("You must provide params body");
    }
    if ( ! params.from ) {
      console.error('You must provide params from', params);
      throw new Error("You must provide params from");
    }
    if ( ! params.to ) {
      console.error('You must provide params to', params);
      throw new Error("You must provide params to");
    }
    //console.info('sms 3');
    const to = yield validNumber(params.to);
    const from = yield validNumber(params.from);
    //console.info('from and to', from, to);
    //console.info('sms 4');
    newParams = {
      to,
      from,
      body: params.body
    };
    console.info('new params', newParams);
    const result = yield nexmo.sendSms(
      newParams.from,
      newParams.to,
      newParams.body,
      {}
    );
    console.info('message sent successfully');
    //console.info('sms 6');
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
