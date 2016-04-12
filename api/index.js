'use strict';
if ( ! process.env.ENVIRONMENT ) {
  throw new Error("No environment provided");
}
require('babel-core/register');
require('app-module-path').addPath(__dirname);

require('../shared/scaffolding');
require('./server');
