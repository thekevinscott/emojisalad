'use strict';
// set require path
require('app-module-path').addPath(__dirname);
let gulp = require('gulp');
let util = require('gulp-util');
let Promise = require('bluebird');
let childExec = require('child_process').exec;
let argv = require('yargs').argv;
let mocha = require('gulp-mocha');
let nodemon = require('gulp-nodemon');
let chalk = require('chalk');
let squel = require('squel');

require("babel-polyfill");

function exec(command) {
  let deferred = Promise.pending();
  childExec(command, function(error, stdout, stderr) {
    if ( error ) {
      deferred.reject(error);
    } else if ( stderr && stderr.indexOf('Warning') === -1 ) {
      deferred.reject(stderr);
    } else {
      deferred.resolve(stdout);
    }
  });
  return deferred.promise;
}

function getConnectionString(config) {
  return [
    '-u',
    config.user,
    '-p\'' + config.password+'\'',
    '-h',
    config.host,
    config.database,
  ].join(' ');
}

function pullProductionDB() {

  process.env.ENVIRONMENT = 'production';
  let config = require('../config/db').production;
  //let config = require('db').config;
  let tmp = 'tmp/';
  //let destination = tmp+'production.sql.gz';
  let file = 'db_backup.sql';
  let zippedFile = 'db_backup.sql.gz';

  let dumpSchemas = [
    'mysqldump',
    '--no-data',
    '--add-drop-table',
    getConnectionString(config),
    '|',
    'gzip >',
    tmp+zippedFile
  ];

  // these tables have data we want
  // and need
  let tablesHavingData = [
    'admins',
    'avatars',
    //'game_numbers',
    'game_states',
    'messages',
    'round_states',
    'player_states'
  ];
  let dumpData = [
    'mysqldump',
    '--opt',
    getConnectionString(config),
    tablesHavingData.join(' '),
    '|',
    'gzip >>',
    tmp+zippedFile
  ];
  return exec('mkdir -p '+tmp).then(function() {
    return exec('rm -f '+tmp+file);
  }).then(function() {
    console.log('dumping schemas');
    return exec(dumpSchemas.join(' '));
  }).then(function() {
    console.log('dumping data');
    return exec(dumpData.join(' '));
  }).then(function() {
    console.log('gunzipping');
    return exec('gunzip '+tmp+zippedFile);
  }).then(function() {
    console.log(tmp+file);
    return tmp+file;
  });
}

gulp.task('sync', function() {
  let tmp = 'tmp/';
  let keys = Object.keys(argv);
  // environment is 1
  let importKey = keys[1];
  if ( importKey === 'production' ) {
    throw "WHOA WHOA WHOA NO KILLING PRODUCTION";
  } else {
    process.env.ENVIRONMENT = importKey;
  }
  let config = require('../config/db')[importKey];
  pullProductionDB().then(function(file) {
    console.log('got file', file);
    let importDB = [
      'mysql',
      getConnectionString(config),
      '<'+ file
    ];
    console.log('import into db', importKey);
    return exec(importDB.join(' '));
  }).catch(function(e) {
    console.log('e', e);
  }).done(function() {
    console.log('done, remove tmp file');
    exec('rm -rf '+tmp).then(function() {
      process.exit(0);
    });
  });
});


/*
 * Testing Tasks
 */
gulp.task('sync-testing-db', function(cb) {

  process.env.ENVIRONMENT = 'test';
  process.env.PORT = '5005';
  let tmp = 'tmp/';
  let testDB = 'test/fixtures/test-db.sql';
  return pullProductionDB().then(function(file) {
    return exec(['rm -f',testDB].join(' ')).then(function() {
      return exec(['mv',file,testDB].join(' '));
    });
  }).done(function() {
    return exec('rm -rf '+tmp).then(function() {
      process.exit(0);
    }).then(function() {
      cb();
    });
  });
});

function resetTestingDB() {
  const db = require('db');
  // import the Bot DB
  process.env.ENVIRONMENT = 'test';
  process.env.PORT = '5005';
  let sql_file = 'test/fixtures/test-db.sql';
  let config = require('../config/db');
  let importDB = [
    'mysql',
    getConnectionString(config.test),
    '<'+ sql_file 
  ];

  return exec(importDB.join(' ')).then(function() {
    // set up phrases
    //let query = squel
                //.insert()
                //.into('phrases')
                //.setFieldsRows([
                  //{ id: 1, phrase: 'JURASSIC PARK', admin_id: 16 },
                  //{ id: 2, phrase: 'SILENCE OF THE LAMBS', admin_id: 16 },
                  //{ id: 3, phrase: 'TIME AFTER TIME', admin_id: 16 },
                  //{ id: 4, phrase: 'BUFFALO WILD WINGS', admin_id: 16 },
                //]);
    //return db.api.query(query.toString());
  }).then(function() {
    // set up game numbers
    let query = squel
                .insert()
                .into('game_numbers')
                .setFieldsRows([
                  { id: 1, number: '+15559999999' },
                  { id: 2, number: '+15551111111' },
                ]);
    return db.query(query.toString());
  }).then(function() {
    // set up clues
    //let query = squel
                //.insert()
                //.into('clues')
                //.setFieldsRows([
                  //{ id: 1, phrase_id: 1, clue: 'MOVIE' },
                  //{ id: 2, phrase_id: 1, clue: 'CLEVER GIRL' },
                  //{ id: 3, phrase_id: 1, clue: 'DINOSAURS' },
                  //{ id: 4, phrase_id: 2, clue: 'MOVIE' },
                  //{ id: 5, phrase_id: 2, clue: 'CLARICE' },
                //]);
    //return db.api.query(query.toString());
  }).then(function() {
    const promises = ['players', 'users', 'games', 'rounds'].map(function(key) {
      let query = squel
                  .delete()
                  .from(key);
      return db.query(query.toString());
    });
    return Promise.all(promises);
  }).then(function() {
  });
}
gulp.task('test', function() {
  process.env.ENVIRONMENT = 'test';
  process.env.PORT = '5005';
  return resetTestingDB().then(function() {
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
  });
});
