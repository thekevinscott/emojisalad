/****
 *
 * Gulp file for the Bot
 *
 *
 */

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
  process.env.ENVIRONMENT = 'test';
  const test = require('./config/database/test');
  const db = require('./db');

  return shared.importDB(test, sql_file).then(() => {
    // various deleting commands
    const seed = require('./test/fixtures/seed') || [];
    // various seeding commands
    return Promise.all(seed.map((cmd) => {
      let query = squel
                  .insert()
                  .into(cmd.table)
                  .setFieldsRows(cmd.rows);
      return db.query(query.toString());
    }));
  });
}

/**
 * This pulls down the production database and copies it into the test folder
 */
gulp.task('update-fixtures', (cb) => {
  const production = require('./config/database/production');
  const tmp = 'tmp/';
  // these tables have data we want
  // and need
  const tables = [
    {
      table: 'messages',
      data: true
    },
  ];
  return shared.pullDB(production, tmp, tables).then((file) => {
    return shared.exec(['rm -f',sql_file].join(' ')).then(() => {
      return shared.exec(['mv',file,sql_file].join(' '));
    });
  }).done(() => {
    console.log('done, remove tmp file', tmp);
    shared.exec('rm -rf '+tmp).then(() => {
      process.exit(0);
      cb();
    });
  });
});

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
  return seed().then(() => {
    process.env.DEBUG = util.env.debug || false;
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

gulp.task('server', () => {
  //process.env.DEBUG = util.env.debug || false;
  //console.log('DEBUG', util.env.debug);
  //console.log('here comes server', args);
  const DEBUG = util.env.DEBUG || 'true';
  const PORT = util.env.PORT || '5000';
  const ENVIRONMENT = util.env.ENVIRONMENT || 'development';
  const QUEUES = util.env.QUEUES || 'sms';
  const TEST_PORT = util.env.TEST_PORT || '5999';
  const API_PORT = util.env.API_PORT || '1338';

  //console.log(TEST_PORT, API_PORT, QUEUES, PORT);

  const env = {
    'ENVIRONMENT': ENVIRONMENT,
    'DEBUG': DEBUG,
    'PORT': PORT,
    'QUEUES': QUEUES,
    //'TEST_PORT': TEST_PORT,
    //'API_PORT': API_PORT
  };

  //console.log('GET READY FOR THAT NODE MAN');
  nodemon({
    script: 'index.js',
    env: env
  })
});

gulp.task('default', () => {
  console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* test - Reimports the local database file, seeds with data, and runs the test suite');
  console.log('* seed - Reimports the local database file and seeds with data');
  console.log('* server - Spins up the server with default arguments');
});

