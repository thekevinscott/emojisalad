'use strict';
const db = require('../db');
const squel = require('squel');

module.exports = function delivery(req, res) {
  const params = req.body;
  if (!params.status || !params.messageId) {
    console.info('This is not a delivery receipt');
  } else {
    if (params.status !== 'delivered') {
      console.info('Fail: ' + params.status);
    } else { // Success!
      console.info(params);
    }
  }
  res.status(200).end();
}
