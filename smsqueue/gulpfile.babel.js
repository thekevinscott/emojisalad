'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const Promise = require('bluebird');
const childExec = require('child_process').exec;
const mocha = require('gulp-mocha');
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

/**
 * Seed the test suite from the saved SQL file,
 * and some seed commands in here, then run the test suite
 */
gulp.task('test', (cb) => {
  process.env.LOG_LEVEL = util.env.LOG_LEVEL || 'warning';
  return gulp.src(['test/index.js'], { read: false })
  .pipe(mocha({
    timeout: 10000,
    slow: 500,
    bail: true
  }))
  .on('error', function(data) {
    console.error(data.message);
    process.exit(1);
  })
  .once('end', function() {
    process.exit();
  });
});

gulp.task('default', () => {
  console.log('* server - Spins up the server with default arguments');
  console.log('* test - Run tests for SMS Queue');
});
