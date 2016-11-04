'use strict';
//const nexmo = require('config/nexmo');

const phoneFormatter = require('phone-formatter');

const phone = (number) => {
  return Promise.resolve(`1${phoneFormatter.normalize(number)}`);
};

module.exports = phone;
