'use strict';
//const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const from_name = 'EmojiBot';
const _ = require('lodash');

module.exports = Promise.coroutine(function* (params) {
  const url = `url to integration test`;

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
