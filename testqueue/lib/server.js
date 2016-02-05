'use strict';
const queue = require('queue');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

queue({
  name: 'testqueue',
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/send'),
});
