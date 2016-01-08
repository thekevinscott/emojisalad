'use strict';

const store = require('store');
const Promise = require('bluebird');

const getTimestamp = Promise.coroutine(function* (runTime) {
  if ( ! runTime ) {
    throw new Error('You must provide a runtime');
  }
  const lastRecordedSMSTimestamp = yield store('sms-timestamp');
  console.debug('gotten sms timestamp', lastRecordedSMSTimestamp);
  const d = new Date(lastRecordedSMSTimestamp).getTime();
  const runtimeDate = getRuntimeDate(runTime);
  if (! lastRecordedSMSTimestamp || d < runtimeDate ) {
    console.debug('too old, return sooner timestamp');
    return runtimeDate;
  }
  return lastRecordedSMSTimestamp;
});

function getRuntimeDate(runTime) {
  const d = new Date();
  return d.getTime() - (runTime*1000);
}

module.exports = getTimestamp;
