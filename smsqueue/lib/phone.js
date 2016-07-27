'use strict';
const config = require('config/twilio');
const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(config.accountSid, config.authToken);

const phone = (number) => {
  console.info('incoming number to check', number);
  let getAsync = Promise.promisify(client.phoneNumbers(number).get);

  return getAsync().then((number) => {
    if ( number && number.phoneNumber ) {
      return number.phoneNumber;
    } else {
      throw new Error('No number found');
    }
  }).catch((err) => {
    if ( ! err ) {
      console.error('unknown twilio error', number);
      throw new Error('Unknown Error');
    } else if ( err.code === 20404 ) {
      //console.error('phone number invalid', err);
      throw new Error('Invalid Phone Number: ' + number);
    } else if ( err.code === 20003 ) {
      console.error('authentication error', err);
      throw new Error('Unknown Error');
    } else {
      console.error('authentication error', err);
      throw err;
    }
  });
};

module.exports = phone;
