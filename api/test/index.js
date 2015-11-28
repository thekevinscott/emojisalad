'use strict';
require('chai').should();
let Promise = require('bluebird');
Promise.longStackTraces();

console.debug = function() {
  let DEBUG = false;
  if ( DEBUG ) {
    console.log.apply(null, arguments);
  }
};

require('./integration/suite');
require(__dirname + '/unit-tests/models/game');
//require(__dirname + '/unit-tests/models/invite');
