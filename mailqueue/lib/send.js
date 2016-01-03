'use strict';
const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const from_name = 'EmojiBot';
const _ = require('lodash');

module.exports = Promise.coroutine(function* (params) {
  const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
  const newParams = {
    to: params.to,
    from: `${from_name} <mailgun@${config.domain}>`,
    body: params.body
  };
  try {
    const result = yield request({
      method: 'POST',
      url: url,
      form: _.assign({}, newParams, {
        subject: params.body,
        text: params.body
      })
    });
  } catch(err) {
    console.error('error', err);
  }

  return params;

});
