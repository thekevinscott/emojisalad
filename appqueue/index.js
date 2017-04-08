'use strict';

return 'foo';
require('babel-register', { });

// set require path
require('app-module-path').addPath(__dirname);

require('../shared/scaffolding');
require('app/server');
