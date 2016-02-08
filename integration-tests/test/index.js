'use strict';
const color = 'bgBlack';
const chalk = require('chalk');
let chai = require('chai');
chai.should();
let expect = chai.expect;
chai.use(require('chai-datetime'));
let Promise = require('bluebird');
//Promise.longStackTraces();

const LOG_LEVEL = (process.env.LOG_LEVEL !== undefined) ? process.env.LOG_LEVEL : 'warning';
console.info = (...args) => {
  if ( LOG_LEVEL === 'info' ) {
    args.unshift(new Date());
    console.debug.apply(null, args);
  }
};
console.debug = (...args) => {
  if ( LOG_LEVEL === 'info' || LOG_LEVEL === 'warning' ) {
    args.unshift(new Date());
    console.log.apply(null, args.map(chalk[color]));
  }
};

// Perform a sanity check across the three servers
// to ensure they're all working and responding
//require('./sanity');

// Run the integration test suite
require('./suite');
