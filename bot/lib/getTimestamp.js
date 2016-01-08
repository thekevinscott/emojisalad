'use strict';

const store = require('store');
const Promise = require('bluebird');

const getTimestamp = Promise.coroutine(function* (runTime) {
  if ( ! runTime ) {
    throw new Error('You must provide a runtime');
  }
  const lastRecordedSMSTimestamp = yield store('sms-timestamp');
  const d = new Date(lastRecordedSMSTimestamp);
  if (d.getTime() < (new Date()).getTime() - (runTime*1000)) {
    let date = (new Date());
    date.setSeconds(date.getSeconds() - runTime);
    return date;
  }
  return lastRecordedSMSTimestamp;
});

module.exports = getTimestamp;
