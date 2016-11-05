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
      newParams.from.slice(1),
      newParams.to,
      newParams.body,
      {}
    );
    console.info('message sent successfully', result);
    //console.info('sms 6');
    if ( result.status === 0 ) {
      return {
        status: 0
      };
    } else {
      return {
        status: 1
      };
    }
  } else {
    return {};
  }
});

module.exports = sms;

const validNumber = Promise.coroutine(function* (number) {
  return yield phone(number);
});
