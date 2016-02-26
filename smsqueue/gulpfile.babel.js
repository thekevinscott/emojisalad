'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const Promise = require('bluebird');
const childExec = require('child_process').exec;
//const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
const squel = require('squel');

const shared = require('../shared/gulp');
const app = require('config/app');

gulp.task('server', (opts) => {
  const PORT = util.env.PORT || app.port;
  const LOG_LEVEL = util.env.LOG_LEVEL || app.log_level;
  return shared.server({ LOG_LEVEL: LOG_LEVEL, PORT: PORT })();
});

gulp.task('default', () => {
  console.log('* server - Spins up the server with default arguments');
});