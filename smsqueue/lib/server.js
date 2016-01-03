'use strict';

const queue = require('queue');

queue({
  port: require('config/app').port,
  parse: require('lib/parse'),
  send: require('lib/sms')
});
