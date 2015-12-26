const config = require('config/twilio').production;
const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(config.accountSid, config.authToken);

const phone = Promise.coroutine(function* (number) {
  let getAsync = Promise.promisify(client.phoneNumbers(number).get);

  return getAsync().then(function(number) {
    return number.phoneNumber;
  }).catch(function(err) {
    if ( ! err ) {
      console.error('unknown twilio error', number);
      throw new Error('Unknown Error');
    } else if ( err.code === 20404 ) {
      console.error('phone number invalid', err);
      throw new Error('Invalid Phone Number: ' + number);
    } else if ( err.code === 20003 ) {
      console.error('authentication error', err);
      throw new Error('Unknown Error');
    } else {
      throw err;
    }
  });
});

module.exports = phone;
