'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const getMessages = Promise.coroutine(function* (timestamp) {
  const response = yield request({
    url: queues.sms.received,
    method: 'GET',
    qs: {
      date: timestamp
    }
  });

  let body = response.body;

  try { body = JSON.parse(body);
  } catch(err) {} // if err, already parsed

  return body;
});

module.exports = getMessages;
