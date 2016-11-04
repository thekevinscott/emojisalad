'use strict';
const nexmo = require('config/nexmo');

const phone = (number) => {
  console.info('incoming number to check', number);

  return nexmo.verify(number).then(number => {
    if ( number && number.phoneNumber ) {
      return number.phoneNumber;
    } else {
      throw new Error('No number found');
    }
  }).catch((err) => {
    if ( ! err ) {
      console.error('unknown nexmo error', number);
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
