'use strict';
//const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const _ = require('lodash');

module.exports = Promise.coroutine(function* (params) {
  console.debug('TIME TO SEND from the ol test queue');
  
   
  const url = `http://localhost:${process.env.CALLBACK_PORT}`;
  console.debug('url', url);

  try {
    const result = yield request({
      method: 'POST',
      url: url,
      form: params
    });
  } catch(err) {
    console.error('error', err);
  }

  return params;
});
