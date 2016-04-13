'use strict';
const Promise = require('bluebird');
const config = require('config/facebook');
const request = Promise.promisify(require('request'));

module.exports = (params) => {
  return sendTextMessage(params).then((response) => {
    console.log('response', response);
    return {
      status: 2
    };
  }).catch((err) => {
    console.error('err', err);
    return {
      status: 3
    };
  });
};

function sendTextMessage(params) {
  return request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: config.token
    },
    method: 'POST',
    json: {
      recipient: {
        id: params.to
      },
      message: {
        text: params.body
      }
    }
  });
}
