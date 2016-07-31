'use strict';
// set require path

require('app-module-path').addPath(__dirname);
require('babel-polyfill');
//require('app-module-path').addPath(__dirname);
const chalk = require('chalk');
const gulp = require('gulp');
const util = require('gulp-util');
const d = require('node-discover')();
const lzw = require('node-lzw');
const Promise = require('bluebird');
//const argv = require('yargs').argv;
const mocha = require('gulp-mocha');
//const nodemon = require('gulp-nodemon');
//const chalk = require('chalk');
const squel = require('squel');

const shared = require('../shared/gulp');
const sql_file = 'test/fixtures/test-db.sql';

function startTestQueue() {
  const cmd = {
    chdir: '../testqueue',
    name: 'testqueue',
    color: 'green',
    port: '1596',
    args: [
      '--CALLBACK_PORT',
      '3999',
      '--LOG_LEVEL',
      'info'
    ]
  };
  return new Promise((resolve) => {
    let begin_talking = false;
    process.chdir(cmd.chdir);
    const command = 'gulp';
    const args = [
      'server',
      '--ENVIRONMENT',
      'test',
      '--LOG_LEVEL',
      'warning',
      '--PORT',
      cmd.port
    ].concat(cmd.args || []);

    const child = shared.spawn(command, args);
    d.on('added', (obj) => {
      if ( obj.advertisement ) {
        const service = JSON.parse(lzw.decode(obj.advertisement));
        if ( service.available ) {
          begin_talking = true;

          process.chdir('../api');
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
}

function stopTestQueue(testqueue) {
  return new Promise((resolve) => {
    //return testqueue.slaughter().then(() => {
    resolve();
    //});
  });
}

/**
 * This imports the stored SQL file, then seeds it
 * with required data
 */
function seed(ENV) {
  process.env.ENVIRONMENT = ENV || 'development';
  console.log('This will import the locally saved seed file into the ${process.env.ENVIRONMENT} database');
  const config = require(`./config/database/${process.env.ENVIRONMENT}`);
  const db = require('./db');

  return shared.importDB(config, sql_file).then(() => {
    // various deleting commands
    const seedData = require('./test/fixtures/seed') || [];
    // various seeding commands
    return Promise.all(seedData.map((cmd) => {
      const query = squel
                    .insert()
                    .into(cmd.table)
                    .setFieldsRows(cmd.rows);
      return db.query(query.toString());
    }));
  });
}
function seed_test() {
  return seed('test');
}

/**
 * This pulls down the production database and copies it into the test folder
 */
gulp.task('update-fixtures', (cb) => {
  console.log('This will pull down the production database and copy it into the test folder.');
  const production = require('./config/database/production');
  const tmp = 'tmp/';
  // these tables have data we want
  // and need
  const tables = [
    'categories',
    'clues',
    'emojis',
    {
      data: false,
      table: 'game_numbers'
    },
    {
      data: false,
      table: 'games'
    },
    'game_phrases',
    {
      data: false,
      table: 'guesses'
    },
    {
      data: false,
      table: 'invites'
    },
    'phrases',
    {
      data: false,
      table: 'players'
    },
    {
      data: false,
      table: 'rounds'
    },
    {
      data: false,
      table: 'users'
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

/**
 * Seed the test suite from the saved SQL file,
 * and some seed commands in here, then run the test suite
 */
gulp.task('test', (cb) => {
  startTestQueue().then((testqueue) => {
    return seed_test().then(() => {
      return testqueue;
    });
  }).then((testqueue) => {
    process.env.LOG_LEVEL = util.env.LOG_LEVEL || 'warning';
    process.env.ENVIRONMENT = 'test';
    process.env.PORT = 1331;

    return new Promise((resolve, reject) => {
      gulp.src(['./test/index.js'], { read: false })
      .pipe(mocha({
        timeout: 3000,
        slow: 500,
        bail: util.env.BAIL || false
      }))
      .on('error', (data) => {
        //console.log('mocha caught error', data.message);
        return stopTestQueue(testqueue).then(() => {
          reject(data.message);
        });
      })
      .once('end', () => {
        //console.log('mocha is done');
        return stopTestQueue(testqueue).then(() => {
          resolve();
        });
      });
    });
  }).then(() => {
    process.exit();
  }).catch((err) => {
    process.exit(1);
  }).done(() => {
    cb();
  });
});

gulp.task('seed', (cb) => {
  seed().then(() => {
    cb();
  }).done(() => {
    process.exit();
  });
});

gulp.task('seed_test', (cb) => {
  seed_test().then(() => {
    cb();
  }).done(() => {
    process.exit();
  });
});

gulp.task('server', () => {
  const LOG_LEVEL = util.env.LOG_LEVEL || 'warning';
  if ( ! util.env.ENVIRONMENT ) {
    throw new Error('You must provide an environment');
  }
  const ENVIRONMENT = util.env.ENVIRONMENT;
  return shared.server({ LOG_LEVEL, ENVIRONMENT })();
});

gulp.task('default', () => {
  console.log('* update-fixtures - this pulls a copy of the matching production database and saves it to the test fixtures folder. Run this whenever there\'s a database change on production');
  console.log('* test - Reimports the local database file, seeds with data, and runs the test suite');
  console.log('* seed - Reimports the local database file and seeds with data');
  console.log('* seed_test - Reimports the local database file into the test database and seeds with data');
  console.log('* server - Spins up the server with default arguments');
});
