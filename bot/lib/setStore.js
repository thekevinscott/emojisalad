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
    obj[message.protocol].push(message);
    return obj;
  }, {});
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    const key = `${protocol}_queue_id`;
    const message = messages_by_protocol[protocol].sort((a, b) => {
      return a.id > b.id;
    }).pop();
    return store(key, message.id);
  }));
};
/*
const setTimestamp = (messages) => {
  if ( _.isArray(messages) ) {
    if ( messages.length ) {
      // make a note of the last messages timestamp
      let lastMessageTimestamp = messages.reduce((initial, message) => {
        if ( initial ) {
          if ( getDate(initial.timestamp) > getDate(message.timestamp) ) {
            return initial;
          }
        }
        return message;
      }).timestamp;
      console.info('last message timestamp', lastMessageTimestamp);
      return store(keys.TIMESTAMP, lastMessageTimestamp);
    } else {
      return store(keys.TIMESTAMP, (new Date()).getTime() / 1000);
    }
  } else {
    return store(keys.TIMESTAMP, messages);
  }
}
*/

//function getDate(str) {
  //const timestamp = new Date(str);
  //if ( str.length > 20 && str.split('.').length === 2 ) {
    //timestamp.setMilliseconds(str.split('.').pop());
  //}
  //return timestamp.getTime() / 1000;
//}

module.exports = setStore;
