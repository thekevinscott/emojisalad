'use strict';
let chai = require('chai');
chai.should();
chai.use(require('chai-datetime'));
let expect = chai.expect;
chai.use(require('chai-datetime'));
let Promise = require('bluebird');
//Promise.longStackTraces();

require('../../shared/scaffolding');

// start up the server
require('server');

//require(__dirname + '/unit-tests/models/game');
require('./unit/controllers/users');
require('./unit/controllers/games');
require('./unit/controllers/players');
require('./unit/controllers/emoji');
require('./unit/controllers/invites');
require('./unit/controllers/rounds');
