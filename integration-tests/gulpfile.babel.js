'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const Promise = require('bluebird');
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
    console.log('seeding', gulpfile);
    return shared.exec(seed_command);
  }));
}

/**
 * This starts the various servers
 */

function startServers(debug, servers_debug) {
  const api_port = 1339;
  const bot_port = 5001;
  const test_port = 5999;

  const commands = [
    {
      chdir: '../api',
      listen: 'EmojinaryFriend API',
      port: api_port 
    },
    {
      chdir: '../testqueue',
      listen: 'Test Queue',
      port: test_port,
      args: [
        '--BOT_PORT',
        bot_port
      ]
    },
    {
      chdir: '../bot',
      listen: 'EmojinaryFriend Bot',
      args: [
        '--QUEUES',
        'test',

        '--TEST_PORT',
        test_port,
        '--API_PORT',
        api_port
      ],
      port: bot_port
    }
  ];

  return Promise.all(commands.map((cmd) => {
    return new Promise((resolve) => {
      let child;
      process.chdir(cmd.chdir);
      const stdout = (data, command, args) => {
        if ( servers_debug ) {
          console.log(`${data}`);
        }
        if ( data.indexOf(cmd.listen) !== -1 ) {
          //console.log('started', cmd.chdir);
          resolve(child);
        }
      };
      const stderr = (data, command, args) => {
        console.log(`stderr: ${data}`);
      };
      const close = (data, command, args) => {
        console.log(`${command} ${args} close: ${data}`);
      };
      const command = 'gulp';
      const args = [
        'server',
        '--DEBUG',
        debug,
        '--ENVIRONMENT',
        'test',
        '--PORT',
        cmd.port
      ].concat(cmd.args || []);
      child = shared.spawn(command, args, stdout, stderr, close);
    });
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
  //return seed().then(() => {
    //return startServers(process.env.DEBUG);
  //}).then((res) => {
  const servers_debug = false;
  let servers = [];
  function killServers() {
    return servers.map((server) => {
      server.stdin.pause();
      server.kill();
    });
  }
  startServers(process.env.DEBUG, servers_debug).then((resp) => {
    console.log('Servers started, starting tests');
    servers = resp;
    //console.log('got a child back', servers);
    process.chdir('../integration-tests');
    servers.map((server) => {
      server.stderr.on('data', (data) => {
        killServers();
        process.exit(1);
      });
    });
    return gulp.src(['test/index.js'], { read: false })
    .pipe(mocha({
      timeout: 10000,
      slow: 500,
      bail: true
    }))
    .on('error', function(data) {
      console.log('error');
      //console.error(data.message);
      killServers();
      process.exit(1);
    })
    .once('end', function() {
      killServers();
      process.exit();
    });
  }).catch(function(err) {
    console.log('caught', err);
    //killServers();
    console.error(err);
    process.exit(1);
  }).done(() => {
    //console.log('done');
    //killServers();
    //cb();
  });
});

gulp.task('default', () => {
  //console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* seed - Reimports the local database files for testqueue, API, and Bot, and seeds with data');
  console.log('* test - Resets the databases, spins up servers for testqueue, API, and Bot, and runs the integration test suite');
});

