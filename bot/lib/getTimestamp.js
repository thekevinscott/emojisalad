'use strict';

const store = require('store');
const Promise = require('bluebird');

const getTimestamp = Promise.coroutine(function* (runTime) {
  if ( ! runTime ) {
    throw new Error('You must provide a runtime');
  }
  const lastRecordedSMSTimestamp = yield store('sms-timestamp');
  const d = new Date(lastRecordedSMSTimestamp).getTime();
  const runtimeDate = getRuntimeDate(runTime);
  if (d < runtimeDate ) {
    return runtimeDate;
  }
  return lastRecordedSMSTimestamp;
});

function getRuntimeDate(runTime) {
  const d = new Date();
  return d.getTime() - (runTime*1000);
}

module.exports = getTimestamp;
