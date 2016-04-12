'use strict';
const Email = require('models/email');

module.exports = [
  {
    path: '/:email',
    method: 'get',
    fn: parse
  }
];

function parse(req) {
  const email = req.params.email;
  return Email.parse(email).then((result) => {
    return { email: result };
  }).catch((err) => {
    switch(err) {
    case 1:
      return { error: 'Invalid email' };
      break;
    default:
      return { error: err };
      break;
    }
  });
}

