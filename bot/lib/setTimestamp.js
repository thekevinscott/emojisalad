'use strict';

const store = require('store');
const Promise = require('bluebird');
const _ = require('lodash');
const keys = require('../config/keys');

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
    }
  } else {
    return store(keys.TIMESTAMP, messages);
  }
}

function getDate(str) {
  const timestamp = new Date(str);
  if ( str.length > 20 && str.split('.').length === 2 ) {
    timestamp.setMilliseconds(str.split('.').pop());
  }
  return timestamp.getTime() / 1000;
}

module.exports = setTimestamp;
