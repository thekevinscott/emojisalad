'use strict';
// we always use production
const config = require('../../config/twilio').production;
//const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient
const client = new LookupsClient(config.accountSid, config.authToken);

let Phone = {
  parse: (passed_numbers) => {
    return Promise.all(passed_numbers.map((passed_number) => {
      if ( ! passed_number ) {
        throw new Error(8);
      } else {
        //const getAsync = Promise.promisify(client.phoneNumbers(passed_number).get);

        console.log('client', client);
        const phoneNumbers = client.phoneNumbers(passed_number);
        return new Promise((resolve, reject) => {
          phoneNumbers.get((error, number) => {
            if ( error ) {
              // 20404 means phone number was invalid,
              // so only show the error if it is 
              // not that
              if ( error && error.code !== 20404 ) {
                console.error('Twilio erroror', error);
              } else {
                console.error('Some other unknown erroror', error);
              }
              // Error 1 means phone number was invalid
              //throw new Error(1);
              reject(1);
            } else {
              console.log('number', number);
              //return client.phoneNumbers(passed_number).get().then((number) => {
              resolve(number.phoneNumber);
            }
          });
        });
      }
    }));
  }
};

module.exports = Phone;
