'use strict';

const ports = {
  sms: process.env.SMS_PORT || '5009',
  test: process.env.TEST_PORT || '5999',
  api: process.env.API_PORT || '1338'
}
const sms_endpoint = `http://localhost:${ports.sms}/`;
const test_endpoint = `http://localhost:${ports.test}/`;

const services = {
  queues: {
    sms: {
      get send() {
        return sms_endpoint + 'send'
      },
      get received() {
        return sms_endpoint + 'received'
      }
    },
    test: {
      get send() {
        return test_endpoint + 'send'
      },
      get received() {
        return test_endpoint + 'received'
      }
    },
  },
  api: {
    url: `http://localhost:${ports.api}/`
  }
}

module.exports = services;
