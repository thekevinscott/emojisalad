'use strict';
const config = require('config/mailgun');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const fetch = require('isomorphic-fetch');

const _ = require('lodash');

const from_name = 'EmojiBot';
const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
//const url = `https://api.mailgun.net/v3/${config.domain}/messages`;
module.exports = (params) => {
  console.info('CUSTOM SEND FUNCTION', params);
  const newParams = {
    //to: params.to,
    to: 'thekevinscott@gmail.com',
    from: `${from_name} <emojibot@${config.domain}>`,
    text: 'foobar'
  };

  console.info('params to send', newParams);
  console.log(url);

  return request({
    url,
    method: 'POST',
    form: newParams
  }).then((response) => {
    return JSON.parse(response.body);
  }).then((message) => {
    console.log('here we be');
    return { data: JSON.stringify(message) };
  }).catch((err) => {
    console.error('error', err);
  });
};
