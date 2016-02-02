const sms_endpoint = 'http://localhost:5009/';

const services = {
  queues: {
    sms: {
      get send() {
        return sms_endpoint + 'send'
      },
      get received() {
        return sms_endpoint + 'received'
      }
    }
  },
  api: {
    url: 'http://localhost:1338/'
  }
}

module.exports = services;
