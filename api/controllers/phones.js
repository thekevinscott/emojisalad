'use strict';
const Phone = require('models/phone');

module.exports = [
  {
    path: '/:phone',
    method: 'get',
    fn: parse
  }
];

function parse(req) {
  //console.log('req', req.params);
  const phone = req.params.phone;
  return Phone.parse(phone).then((result) => {
    //console.log('phones', phones);
    //const result = phones.pop();
    //console.log('its a good phone number');
    return { phone: result };
  }).catch((err) => {
    //console.log('its a bad phone number', phone, err);
    switch(err) {
    case 1:
      return { error: 'Invalid phone number' };
      break;
    default:
      return { error: err };
      break;
    }
  });
}
