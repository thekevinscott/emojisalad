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

module.exports = {
  verify: (number, brand) => {
    return new Promise(resolve => {
      return nexmo.verify.request({
        number,
        brand,
      }, () => {
        console.log(arguments);
        resolve(arguments);
      });
    });
  },
  sendSms: (sender, recipient, message, options) => {
    return new Promise(resolve => {
      return nexmo.message.sendSms(sender, recipient, message, options, () => {
        resolve({});
        console.log(arguments);
      });
    });
  },
};
