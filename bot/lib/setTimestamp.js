'use strict';

const store = require('store');
const Promise = require('bluebird');

const setTimestamp = Promise.coroutine(function* (messages) {
  if ( messages.length ) {
    // make a note of the last messages timestamp
    let lastMessageTimestamp = messages.reduce(function(initial, message) {
      if ( initial ) {
        if ( getDate(initial.timestamp) > getDate(message.timestamp) ) {
          return initial;
        }
      }
      return message;
    }).timestamp;
    console.debug('last message timestamp', lastMessageTimestamp);
    return yield store('timestamp', lastMessageTimestamp);
  }
});

function getDate(str) {
  const timestamp = new Date(str);
  if ( str.length > 20 && str.split('.').length === 2 ) {
    timestamp.setMilliseconds(str.split('.').pop());
  }
  return timestamp.getTime();
}

module.exports = setTimestamp;
