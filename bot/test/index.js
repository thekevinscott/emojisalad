'use strict';
let chai = require('chai');
chai.should();
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


require(__dirname + '/unit-tests/store');
require(__dirname + '/unit-tests/lib');
//require(__dirname + '/unit-tests/models/game');
require('./integration/suite');
