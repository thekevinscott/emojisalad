'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
const node_util = require('util');
const Promise = require('bluebird');
const argv = require('yargs').argv;
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
const squel = require('squel');
const superagent = require('superagent');
const d = require('node-discover')();
const shared = require('../shared/gulp');
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
    return shared.exec(seed_command);
  })).then((res) => {
    console.log(`Seeding complete`);
    return res;
  });
}

/**
 * This starts the various servers
 */

function startServers(debug, log_level) {
  const servers_debug = false;

  const commands = [
    {
      name: 'api',
      chdir: '../api',
      color: 'yellow',
      //listen: 'EmojinaryFriend API',
      port: api_port,
      args: [
      ]
    },
    {
      chdir: '../testqueue',
      name: 'testqueue',
      color: 'green',
      port: test_port,
      args: [
        '--CALLBACK_PORT',
        '3999'
      ]
    },
    {
      chdir: '../bot',
      name: 'bot',
      color: 'blue',
      args: [
        '--QUEUES',
        [
          'testqueue'
        ].join(','),
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
    const error = data.toString().split('\\n').join('\n');
    console.error(chalk.red(`stderr: ${error}`));
  };
  const close = (data, command, args) => {
    console.log(`${command} ${args} close: ${data}`);
    console.log('server has closed');
    process.exit();
  };

  return Promise.all(commands.map((cmd) => {
    return new Promise((resolve) => {
      let child;
      d.on('added', (obj) => {
        if ( obj.advertisement ) {
          const service = JSON.parse(obj.advertisement);
          if ( service.available ) {
            resolve(child);
          }
        }
      });

      process.chdir(cmd.chdir);
      const command = 'gulp';
      const args = [
        'server',
        '--ENVIRONMENT',
        'test',
        '--LOG_LEVEL',
        log_level,
        '--PORT',
        cmd.port
      ].concat(cmd.args || []);
      child = shared.spawn(command, args, stdout, stderr, close);
      child.options = cmd;
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
  const log_level = util.env.LOG_LEVEL || 'warning';
  let servers = [];
  function killServers() {
    return servers.map((server) => {
      server.stdin.pause();
      server.kill();
    });
  }
  return seed().then(() => {
    return startServers(process.env.DEBUG, log_level);
  }).then((servers) => {
    process.chdir('../integration-tests');

    servers.map((server) => {
      server.stdout.on('data', (data) => {
        if ( process.env.DEBUG ) {
          if ( server.options.color ) {
            console.log(chalk.bold(server.options.name), chalk[server.options.color](`${data}`));
          } else {
            console.log(server.options.name, `${data}`);
          }
        }
      });
      server.stderr.on('data', (data) => {
        //killServers();
        //process.exit(1);
      });
      server.on('close', (data, command, args) => {
        killServers();
        process.exit(1);
      });
    });


    return gulp.src(['test/index.js'], { read: false })
    .pipe(mocha({
      timeout: 30000,
      slow: 1500,
      //bail: true
    }))
    .on('error', function(data) {
      console.error('error', data.message);
      killServers();
      process.exit(1);
    })
    .once('end', function() {
      console.log('end');
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

