'use strict';
require('chai').should();
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

require('./integration/suite');
require(__dirname + '/unit-tests/models/game');
