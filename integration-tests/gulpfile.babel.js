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
const superagent = require('superagent');
const d = require('node-discover')();
const shared = require('../gulp/shared');
const sql_file = 'test/fixtures/test-db.sql';

const services = require('./config/services');
const api_port = services.api.port;
const bot_port = services.bot.port;
const test_port = services.testqueue.port;

/**
 * This imports the stored SQL file, then seeds it
 * with required data
 */
function seed() {
  const commands = [
    {
      chdir: '../api',
    },
    {
      chdir: '../testqueue',
    },
    {
      chdir: '../bot',
    }
  ];
  return Promise.all(commands.map((command) => {
    process.chdir(command.chdir);
    const seed_command = [
      [
        'gulp',
        'seed'
      ].join(' ')
    ];
    //console.log('seeding', command.chdir);
    return shared.exec(seed_command);
  })).then((res) => {
    console.log(`Seeding complete for ${commands.map(cmd => cmd.chdir).join(',')}`);
    return res;
  });
}

/**
 * This starts the various servers
 */

function startServers(debug, servers_debug) {

  const commands = [
    {
      name: 'api',
      chdir: '../api',
      //listen: 'EmojinaryFriend API',
      port: api_port 
    },
    {
      chdir: '../testqueue',
      name: 'testqueue',
      port: test_port
    },
    {
      chdir: '../bot',
      name: 'bot',
      args: [
        '--QUEUES',
        'testqueue',

        '--API_PORT',
        api_port
      ],
      port: bot_port
    }
  ];
  const stdout = (data, command, args) => {
    if ( servers_debug ) {
      console.log(`${data}`);
    }
  };
  const stderr = (data, command, args) => {
    console.log(`stderr: ${data}`);
  };
  const close = (data, command, args) => {
    console.log(`${command} ${args} close: ${data}`);
    console.log('server has closed');
    process.exit();
  };

  return Promise.all(commands.map((cmd) => {
    return new Promise((resolve) => {
      d.on('added', (obj) => {
        if ( obj && obj.advertisement && obj.advertisement.name === cmd.name && obj.advertisement.ready ) {
          console.log(cmd.name, 'added');
          resolve();
        }
      });

      let child;
      process.chdir(cmd.chdir);
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
      //console.log(command, args);
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
  const servers_debug = true;
  let servers = [];
  function killServers() {
    return servers.map((server) => {
      server.stdin.pause();
      server.kill();
    });
  }
  return seed().then(() => {
    return startServers(process.env.DEBUG, servers_debug);
  }).then((resp) => {
  //startServers(process.env.DEBUG, servers_debug).then((resp) => {
    console.log('Servers started, starting tests');
    servers = resp;
    //console.log('got a child back', servers);
    process.chdir('../integration-tests');

    // we need to initialize the bot store with a timestamp
    // THIS SHOULD HAPPEN ON BOOT
    //return request(`http://localhost:${bot_port}/ping`);
  //}).then(() => {
    servers.map((server) => {
      console.log('server', server);
      server.stderr.on('data', (data) => {
        killServers();
        process.exit(1);
      });
      server.on('close', (data, command, args) => {
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

function request(url) {
  return new Promise((resolve, reject) => {
    superagent 
    .get(url)
    .end(function(err, res){
      if ( err ) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

gulp.task('default', () => {
  //console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* seed - Reimports the local database files for testqueue, API, and Bot, and seeds with data');
  console.log('* test - Resets the databases, spins up servers for testqueue, API, and Bot, and runs the integration test suite');
});

