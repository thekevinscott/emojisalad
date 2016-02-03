'use strict';
let chai = require('chai');
chai.should();
let expect = chai.expect;
chai.use(require('chai-datetime'));
let Promise = require('bluebird');
//Promise.longStackTraces();

let DEBUG = (process.env.DEBUG !== undefined) ? process.env.DEBUG : false;
console.debug = function() {
  if ( DEBUG === true || DEBUG === 'true' ) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(new Date());
    console.log.apply(null, args);
  }
};

// Perform a sanity check across the three servers
// to ensure they're all working and responding
require('./sanity');
//require('./integration/suite');
