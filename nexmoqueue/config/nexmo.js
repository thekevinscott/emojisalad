var Nexmo = require('nexmo');

var config = {
  key: '701f9b43',
  secret: '9abfb3144b98840f',
};

var nexmo = new Nexmo({
  apiKey: config.key,
  apiSecret: config.secret,
  //applicationId: config.appID,
  //privateKey: config.privateKey,
}, {
});

const getStatus = messages => messages.reduce((status, message) => {
  if (message.status > 0) {
    return message.status;
  }

  return status;
}, 0);

module.exports = {
  verify: (number, brand) => {
    return new Promise((resolve, reject) => {
      return nexmo.verify.request({
        number,
        brand,
      }, (err, response) => {
        if (err) {
          console.error('Error from verify', err);
          return reject(err);
        }

        console.log('response', response);
        return resolve(response);
      });
    });
  },
  sendSms: (sender, recipient, message, options = {}) => {
    return new Promise((resolve, reject) => {
      console.log('outgoing message', message);
      return nexmo.message.sendSms(sender, recipient, message, {
        ...options,
        type: 'unicode',
      }, (err, response) => {
        if (err || !response.messages) {
          return reject(err);
        }

        let status = getStatus(response.messages);
        return resolve({
          status,
          messageIds: response.messages.map(message => message['message-id']),
          response,
        });
        //console.log('back rom send sms', data, data2);
        //console.log(arguments);
      });
    });
  },
};
