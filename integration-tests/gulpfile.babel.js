'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const Promise = require('bluebird');
const childExec = require('child_process').exec;
const argv = require('yargs').argv;
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
const squel = require('squel');

const shared = require('../gulp/shared');
const sql_file = 'test/fixtures/test-db.sql';

/**
 * This imports the stored SQL file, then seeds it
 * with required data
 */
function seed() {
  const gulp_files = [
    '../testqueue/gulpfile.babel.js',
    '../bot/gulpfile.babel.js',
    '../api/gulpfile.babel.js',
  ];
  return Promise.all(gulp_files.map((gulpfile) => {
    const seed_command = [
      [
        'gulp',
        '--gulpfile',
        gulpfile,
        'seed'
      ].join(' ')
    ];
    console.log(seed_command);
    return shared.exec(seed_command);
  }));
}

/**
 * This starts the various server
 */

function startServers(debug) {
  const index_files = [
    '../api/index.js',
    '../testqueue/index.js',
    '../bot/index.js',
  ];

  const args = [
    '--debug',
    debug
  ];
  return Promise.all(index_files.map((index_file) => {
    const start_api = [
      'supervisor',
      index_file
    ].concat(args).join(' ');
    return shared.exec(start_api);
  }));
}

gulp.task('seed', (cb) => {
  seed().then(() => {
    cb();
  }).done(() => {
    process.exit();
  });
});

/**
 * Seed the test suite from the saved SQL file,
 * and some seed commands in here, then run the test suite
 */
gulp.task('test', (cb) => {
  process.env.DEBUG = util.env.debug || false;
  // Seed the Bot database
  return seed().then(() => {
    return shared.exec(seed_api);
  }).then(() => {
    return startServers(debug);
  }).then((res) => {
    console.log('yay');
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
  }).catch(function(err) {
    console.error(err);
    process.exit(1);
  }).done(() => {
    cb();
  });
});

gulp.task('default', () => {
  //console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* seed - Reimports the local database files for testqueue, API, and Bot, and seeds with data');
  console.log('* test - Resets the databases, spins up servers for testqueue, API, and Bot, and runs the integration test suite');
});

