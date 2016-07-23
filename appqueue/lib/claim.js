'use strict';
const Promise = require('bluebird');
const service = require('microservice-registry');
const request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const db = require('db');

module.exports = function claim(req, res) {
  res.json({ foo: 'bar' });
};
