'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const gulp = require('gulp');
const util = require('gulp-util');
//const node_util = require('util');
const Promise = require('bluebird');
//const argv = require('yargs').argv;
const mocha = require('gulp-mocha');
//const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
//const squel = require('squel');
//const superagent = require('superagent');
const d = require('node-discover')();
const lzw = require('node-lzw');
const shared = require('../shared/gulp');
//const sql_file = 'test/fixtures/test-db.sql';

const services = require('./config/services');
const api_port = services.api.port;
const bot_port = services.bot.port;
const test_port = services.testqueue.port;

/**
 * This imports the stored SQL file, then seeds it
 * with required data
 */
const seed = () => {
  const commands = [
    {
      chdir: '../api'
    },
    {
      chdir: '../testqueue'
    },
    {
      chdir: '../bot'
    }
  ];
  return Promise.all(commands.map((command) => {
    process.chdir(command.chdir);
    const seed_command = [[
      'gulp',
      'seed'
    ].join(' ')];
    return shared.exec(seed_command);
  })).then((res) => {
    console.log(`Seeding complete`);
    return res;
  });
};

/**
 * This starts the various servers
 * Returns an array of children that are the results
 * of require('child_process').spawn
 */

const startServers = (debug, log_level) => {
  const services_debug = false;
  let begin_talking = false;

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
        '3999',
        '--LOG_LEVEL',
        'info'
      ]
    },
    {
      chdir: '../bot',
      name: 'bot',
      color: 'blue',
      args: [
        '--TRIPWIRE_TRIP',
        '9999999',
        '--TRIPWIRE_ALERT',
        '9999999',
        '--PROTOCOLS',
        [ 'testqueue' ].join(',')
      ],
      port: bot_port
    }
  ];
  const stdout = (data) => {
    if ( services_debug ) {
      console.log(`${data}`);
    }
  };
  const stderr = (data) => {
    const error = data.toString().split('\\n').join('\n');
    console.error(chalk.red(`stderr: ${error}`));
  };

  return Promise.all(commands.map((cmd) => {
    return new Promise((resolve) => {

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

      const child = shared.spawn(command, args, stdout, stderr, () => {
        //console.log('close a service');
        //console.log(`close service ${cmd.chdir.split('../').pop()}`);
      });
      d.on('added', (obj) => {
        if ( obj.advertisement ) {
          const service = JSON.parse(lzw.decode(obj.advertisement));
          if ( service.available ) {
            begin_talking = true;
            resolve(child);
          }
        }
      });

      child.stdout.on('data', (data) => {
        if ( process.env.DEBUG && begin_talking ) {
          if ( child.options.color ) {
            console.log(chalk.bold(child.options.name), chalk[child.options.color](`${data}`));
          } else {
            console.log(child.options.name, `${data}`);
          }
        }
      });
      child.options = cmd;

    });
  }));
};

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
gulp.task('test', () => {
  process.env.DEBUG = util.env.debug || false;
  // Seed the Bot database
  const log_level = util.env.LOG_LEVEL || 'warning';
  let servers = [];
  const killServers = () => {
    //console.log('kill teh servers');
    return Promise.all(servers.map((server) => {
      return server.slaughter();
    })).then((servers) => {
      //console.log('all servers killed');
      return servers;
    });
  };
  return seed().then(() => {
    return startServers(process.env.DEBUG, log_level);
  }).then((response) => {
    servers = response;
    process.chdir('../integration-tests');

    return new Promise((resolve, reject) => {
      return gulp.src(['test/index.js'], { read: false })
      .pipe(mocha({
        timeout: 30000,
        slow: 1500,
        bail: util.env.BAIL || false
      }))
      .on('error', (data) => {
        console.log('mocha caught error', data.message);
        //console.error('error', data.message);
        reject(data.message);
      })
      .once('end', () => {
        //console.log('mocha is done');
        resolve();
      });
    });
  }).then(() => {
    //console.log('promise chain has completed');
    return killServers().then(() => {
      //console.log('exit with 0');
      process.exit();
    });
  }).catch((err) => {
    console.error(chalk.red(err));
    return killServers().then(() => {
      //console.log('kill servers has resolved, exit with 1');
      process.exit(1);
    });
  //}).done(() => {
  });
  process.on('exit', () => {
    return killServers();
  });
});

//const request = (url) => {
  //return new Promise((resolve, reject) => {
    //superagent
    //.get(url)
    //.end((err, res) => {
      //if ( err ) {
        //reject(err);
      //} else {
        //resolve(res);
      //}
    //});
  //});
//}

gulp.task('default', () => {
  //console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* seed - Reimports the local database files for testqueue, API, and Bot, and seeds with data');
  console.log('* test - Resets the databases, spins up servers for testqueue, API, and Bot, and runs the integration test suite');
});

