'use strict';

const queue = require('queue');

queue({
  name: require('config/app').name,
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/sms')
});
