'use strict';
require("babel-register", { });

// set require path
require('app-module-path').addPath(__dirname);

require('../shared/scaffolding');
require('./lib/server');
