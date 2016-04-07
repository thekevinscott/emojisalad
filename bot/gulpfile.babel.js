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
const chalk = require('chalk');
const squel = require('squel');

const shared = require('../shared/gulp');
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
      const query = squel
                    .insert({
                      autoQuoteTableNames: true,
                      autoQuoteFieldNames: true
                    })
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
    {
      table: 'attributes',
      data: false
    },
    {
      table: 'protocols',
      data: false
    }
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
  }).catch(function(err) {
    console.error(err);
    process.exit(1);
  }).done(() => {
    cb();
  });
});

gulp.task('server', () => {
  // default protocols
  let PROTOCOLS = [
    'sms'
  ].join(',');

  let PORT = '5000';

  if ( util.env.PROTOCOLS ) {
    PROTOCOLS = util.env.PROTOCOLS;
  }
  if ( util.env.PORT ) {
    PORT = util.env.PORT;
  }

  const LOG_LEVEL = util.env.LOG_LEVEL || 'warning';
  return shared.server({
    PROTOCOLS: PROTOCOLS,
    PORT: PORT,
    LOG_LEVEL: LOG_LEVEL,
    TRIPWIRE_TRIP: util.env.TRIPWIRE_TRIP,
    TRIPWIRE_ALERT: util.env.TRIPWIRE_ALERT 
  })();
});

gulp.task('default', () => {
  console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* test - Reimports the local database file, seeds with data, and runs the test suite');
  console.log('* seed - Reimports the local database file and seeds with data');
  console.log('* server - Spins up the server with default arguments');
  console.log('* update-fixtures - Pulls down a version of the production database');
});

