'use strict';

const store = require('store');
const Promise = require('bluebird');

const getTimestamp = Promise.coroutine(function* (runTime) {
  if ( ! runTime ) {
    throw new Error('You must provide a runtime');
  }
  let lastRecordedSMSTimestamp = yield store('sms-timestamp');
  console.debug('gotten sms timestamp', lastRecordedSMSTimestamp);
  const d = getSeconds((makeDate(lastRecordedSMSTimestamp)));
  const runtimeDate = getRuntimeDate(runTime);
  if (! lastRecordedSMSTimestamp || d < runtimeDate ) {
    console.debug('too old, return sooner timestamp which is', makeDate(runtimeDate));
    return runtimeDate;
  }
  return lastRecordedSMSTimestamp;
});

function getRuntimeDate(runTime) {
  return getSeconds(new Date()) - runTime;
}

function makeDate(timestamp) {
  if ( parseInt(timestamp) ) {
    return new Date(timestamp * 1000);
  } else {
    return new Date(timestamp);
  }
}

function getSeconds(d) {
  return d.getTime() / 1000;
}

module.exports = getTimestamp;
