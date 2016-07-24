'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const registry = require('microservice-registry');
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const api = db.api;

const getUser = require('./getUser');

const getMessages = (userId, type) => {
  return getUser(userId).then(user => {
    const service = registry.get('sms');

    const idType = type === 'received' ? 'from' : 'to';

    const payload = {
      url: service.api[type].endpoint,
      method: service.api[type].method,
      qs: {
        order: 'DESC',
        [idType]: user.from,
        // id is a list of ids to exclude from the returned
        // messages
        //id: [1,2,3],
      },
    };
    return request(payload);
  }).then(response => {
    return JSON.parse(response.body);
  }).then(messages => {
    return messages.map(message => {
      return Object.assign({}, message, {
        type,
      });
    });
  });
};

module.exports = getMessages;
