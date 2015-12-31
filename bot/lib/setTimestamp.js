'use strict';

const store = require('store');

const setTimestamp = function(messages) {
  // make a note of the last messages timestamp
  let lastMessageTimestamp = messages.pop().timestamp;
  console.debug('last message timestamp', lastMessageTimestamp);
  yield store('timestamp', lastMessageTimestamp);
}

module.exports = setTimestamp;
