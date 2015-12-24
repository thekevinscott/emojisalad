'use strict';
require('chai').should();
let Promise = require('bluebird');
Promise.longStackTraces();

let DEBUG = process.env.DEBUG || false;
if ( !console.debug ) {
  console.debug = function() {
    if ( DEBUG ) {
      let args = Array.prototype.slice.call(arguments);
      args.unshift(new Date());
      console.log.apply(null, args);
    }
  };
}

require('./integration/suite');
require(__dirname + '/unit-tests/models/game');
//require(__dirname + '/unit-tests/models/invite');