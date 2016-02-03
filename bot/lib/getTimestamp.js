'use strict';

const store = require('store');
const Promise = require('bluebird');

const getTimestamp = () => {
  return store('sms-timestamp').then((lastRecordedSMSTimestamp) => {
    console.debug('gotten sms timestamp', lastRecordedSMSTimestamp);
    return lastRecordedSMSTimestamp || (new Date()).getTime() / 1000;
  });
};

module.exports = getTimestamp;
