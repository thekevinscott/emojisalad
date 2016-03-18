'use strict';

const store = require('store');
const Promise = require('bluebird');
//const _ = require('lodash');
//const keys = require('../config/keys');

const setStore = (messages) => {
  const messages_by_protocol = messages.reduce((obj, message) => {
    if ( ! obj[message.protocol] ) {
      obj[message.protocol] = [];
    }
    obj[message.protocol].push(message.id);
    return obj;
  }, {});
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    const key = `${protocol}_queue_id`;
    const message_id = messages_by_protocol[protocol].sort().pop();
    //console.log('message id to set', message_id);
    return store(key, message_id);
  }));
};

module.exports = setStore;
