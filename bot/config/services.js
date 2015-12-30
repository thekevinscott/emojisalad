const sms_endpoint = 'http://localhost:5009/';

const services = {
  queues: {
    // how to do a javascript getter
    sms: {
      get send() {
        return sms_endpoint + 'send'
      },
      get received() {
        return sms_endpoint + 'received'
      }
    }
  }
}

module.exports = services;
