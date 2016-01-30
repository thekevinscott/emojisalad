'use strict';
let chai = require('chai');
chai.should();
chai.use(require('chai-datetime'));
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

// start up the server
require('../server');

//require(__dirname + '/unit-tests/models/game');
require('./routes/users');
require('./routes/games');
require('./routes/players');
require('./routes/emoji');
