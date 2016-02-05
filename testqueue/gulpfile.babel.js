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

const shared = require('../gulp/shared');
const sql_file = 'fixtures.sql';

/**
 * This imports the stored SQL file, then seeds it
 * with required data
 */
function seed() {
  process.env.ENVIRONMENT = 'test';
  const test = require('./config/db');
  const db = require('./db');

  return shared.importDB(test, sql_file).then(() => {
    // various deleting commands
    const seed = require('./seed') || [];
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

gulp.task('seed', (cb) => {
  seed().then(() => {
    cb();
  }).done(() => {
    process.exit();
  });
});

gulp.task('server', () => {
  const DEBUG = util.env.DEBUG || 'true';
  const PORT = util.env.PORT || '5999';
  const ENVIRONMENT = util.env.ENVIRONMENT || 'development';
  const BOT_PORT = util.env.BOT_PORT || '5000';
  //console.log('run test queue server');
  nodemon({
    script: 'index.js',
    env: {
      'ENVIRONMENT': ENVIRONMENT,
      'DEBUG': DEBUG,
      'PORT': PORT,
      'BOT_PORT': BOT_PORT,
    }
  });
});

gulp.task('default', () => {
  console.log('* seed - Reimports the local database file and seeds with data');
  console.log('* server - Spins up the server with default arguments');
});
