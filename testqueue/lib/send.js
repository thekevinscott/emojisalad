/**
 *
 * This function should send a message,
 * and return a payload that will be passed
 * to Model.update.
 *
 * So in this case, we will want to always notify
 * that our message was delivered correctly,
 * since this is a test queue
 *
 */
'use strict';
//const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const _ = require('lodash');

module.exports = (params) => {
  const url = `http://localhost:${process.env.CALLBACK_PORT}`;

  request({
    method: 'POST',
    url,
    form: params
  });
  return new Promise((resolve) => {
    resolve({
      status: 1
    });
  });

};
