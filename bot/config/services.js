const sms_endpoint = 'http://localhost:5009/';
const test_endpoint = 'http://localhost:5999/';

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
    url: 'http://localhost:1338/'
  }
}

module.exports = services;
