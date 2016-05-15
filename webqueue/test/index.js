'use strict';
let chai = require('chai');
chai.should();
let expect = chai.expect;
chai.use(require('chai-datetime'));
let Promise = require('bluebird');
//Promise.longStackTraces();

require('../../shared/scaffolding');

require(__dirname + '/unit-tests/phone');
