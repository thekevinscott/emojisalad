'use strict';

const queue = require('queue');

queue({
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/sms')
});
