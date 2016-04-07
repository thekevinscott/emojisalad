'use strict';
const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const fetch = require('isomorphic-fetch');

const _ = require('lodash');

const from_name = 'EmojiBot';
const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
module.exports = (params) => {
  const newParams = {
    to: params.to,
    from: `${from_name} <${params.from}>`,
    subject: 'Your emojinary friend',
    text: params.body
  };

  return request({
    url,
    method: 'POST',
    form: newParams
  }).then((response) => {
    return JSON.parse(response.body);
  }).then((message) => {
    return { data: JSON.stringify(message) };
  }).catch((err) => {
    console.error('error', err);
  });
};
