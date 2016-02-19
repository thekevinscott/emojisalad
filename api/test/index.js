'use strict';
let chai = require('chai');
chai.should();
chai.use(require('chai-datetime'));
let expect = chai.expect;
chai.use(require('chai-datetime'));

require('../../shared/scaffolding');

// start up the server
require('server');

require ('./unit/controllers');
require ('./unit/models');
