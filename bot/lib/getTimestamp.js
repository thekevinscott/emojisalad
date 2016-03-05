'use strict';

const store = require('store');
const Promise = require('bluebird');
//const setTimestamp = require('lib/setTimestamp');
const keys = require('../config/keys');

const getTimestamp = () => {
  //console.info('store keys', keys);
  return store(keys.TIMESTAMP).then((lastRecordedTimestamp) => {
    //console.info('gotten timestamp', lastRecordedTimestamp);
    if ( lastRecordedTimestamp ) {
      return lastRecordedTimestamp;
    } else {
      const now = (new Date()).getTime() / 1000;
      setTimestamp(now);
      return now;
    }
  });
};

module.exports = getTimestamp;
