'use strict';
const Promise = require('bluebird');
const service = require('microservice-registry');
const request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

module.exports = function(req, res) {
  const db = require('../db');

  const query = squel
                .select()
                .from('numbers')
                .where('id > ?', req.query.id);

  return db.query(query).then(response => {
    res.json(response);
  });
};
