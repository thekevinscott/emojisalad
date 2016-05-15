'use strict';
const Promise = require('bluebird');
const service = require('microservice-registry');
const request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

module.exports = function(req, res) {
  const db = require('../db');
  const bot = service.get('bot');
  const phone = req.body.phone;

  const insert_query = squel
                       .insert()
                       .into('numbers')
                       .setFields({ phone });

  return db.query(insert_query).then(response => {
    if (response && response.insertId) {
      res.json({
        id: response.insertId,
        phone: response.phone
      });
    } else {
      res.json({
        error: 1
      });
    }
  });
};
