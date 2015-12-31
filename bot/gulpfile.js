'use strict';
// set require path
require('app-module-path').addPath(__dirname);
var gulp = require('gulp');
var util = require('gulp-util');
var Promise = require('bluebird');
var childExec = require('child_process').exec;
var argv = require('yargs').argv;
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var chalk = require('chalk');
var squel = require('squel');

function exec(command) {
  var deferred = Promise.pending();
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
  //var config = require('db').config;
  var tmp = 'tmp/';
  //var destination = tmp+'production.sql.gz';
  var file = 'db_backup.sql';
  var zippedFile = 'db_backup.sql.gz';

  var dumpSchemas = [
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
  var tablesHavingData = [
    'admins',
    'avatars',
    //'game_numbers',
    'game_states',
    'messages',
    'round_states',
    'player_states'
  ];
  var dumpData = [
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
    return exec(dumpSchemas.join(' '));
  }).then(function() {
    return exec(dumpData.join(' '));
  }).then(function() {
    return exec('gunzip '+tmp+zippedFile);
  }).then(function() {
    return tmp+file;
  });
}

gulp.task('sync', function() {
  var tmp = 'tmp/';
  var keys = Object.keys(argv);
  // environment is 1
  var importKey = keys[1];
  if ( importKey === 'production' ) {
    throw "WHOA WHOA WHOA NO KILLING PRODUCTION";
  } else {
    process.env.ENVIRONMENT = importKey;
  }
  var config = require('../config/db')[importKey];
  pullProductionDB().then(function(file) {
    var importDB = [
      'mysql',
      getConnectionString(config),
      '<'+ file
    ];
    return exec(importDB.join(' '));
  }).catch(function(e) {
    console.log('e', e);
  }).done(function() {
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
  var tmp = 'tmp/';
  var testDB = 'test/fixtures/test-db.sql';
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
  process.env.ENVIRONMENT = 'test';
  process.env.PORT = '5005';
  var sql_file = 'test/fixtures/test-db.sql';
  var config = require('../config/db').test;
  var importDB = [
    'mysql',
    getConnectionString(config),
    '<'+ sql_file 
  ];
  var db = require('db');

  return exec(importDB.join(' ')).then(function() {
    // set up phrases
    var query = squel
                .insert()
                .into('phrases')
                .setFieldsRows([
                  { id: 1, phrase: 'JURASSIC PARK', admin_id: 16 },
                  { id: 2, phrase: 'SILENCE OF THE LAMBS', admin_id: 16 },
                  { id: 3, phrase: 'TIME AFTER TIME', admin_id: 16 },
                  { id: 4, phrase: 'BUFFALO WILD WINGS', admin_id: 16 },
                ]);
    return db.query(query.toString());
  }).then(function() {
    // set up game numbers
    var query = squel
                .insert()
                .into('game_numbers')
                .setFieldsRows([
                  { id: 1, number: '+15559999999' },
                  { id: 2, number: '+15551111111' },
                ]);
    return db.query(query.toString());

  }).then(function() {
    // set up clues
    var query = squel
                .insert()
                .into('clues')
                .setFieldsRows([
                  { id: 1, phrase_id: 1, clue: 'MOVIE' },
                  { id: 2, phrase_id: 1, clue: 'CLEVER GIRL' },
                  { id: 3, phrase_id: 1, clue: 'DINOSAURS' },
                  { id: 4, phrase_id: 2, clue: 'MOVIE' },
                  { id: 5, phrase_id: 2, clue: 'CLARICE' },
                ]);
    return db.query(query.toString());
  });
}
function startServer(server) {
  console.log('start server');
  if ( server === 'test' ) {
    process.env.ENVIRONMENT = 'test';
    process.env.PORT = '5005';
  } else {
    process.env.ENVIRONMENT = 'development';
    process.env.PORT = '5000';
  }

  return nodemon({
    script: 'index.js',
    //verbose: true,
    verbose: false,
    quiet: true,
    "events": {
      //"restart": "osascript -e 'display notification \"app restarted\" with title \"nodemon\"'"
    },
    env: {
      DEBUG: util.env.debug ? util.env.debug : false
      //ENVIRONMENT : 'test',
      //PORT : '5005'
    },
    stdout: false
  });
}
function runTests() {
  return resetTestingDB().then(function() {
    //var deferred = Promise.pending();
    process.env.DEBUG = util.env.debug || false;
    return gulp.src(['test/index.js'], { read: false })
    .pipe(mocha({
      timeout: 10000,
      slow: 500,
      bail: true
    }))
    .on('error', function(data) {
      console.log(data.message);
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
      //deferred.resolve();
    });
  });
  //return deferred.promise;
}
gulp.task('test', function() {
  process.env.ENVIRONMENT = 'test';
  process.env.PORT = '5005';
  /*
  return startServer('test').on('start', function() {
    // process has started
  }).on('stderr', function(data) {
    data = data.toString().trim();
    console.error(chalk.red(data));
  }).on('stdout', function(data) {
    data = data.toString().trim();

    if ( data === 'EmojinaryFriend API' ) {
      return resetTestingDB().then(function() {
    */
        return runTests();
      /*
      });
    } else {
      console.log(chalk.cyan(data));
      //process.stdout.write(data);
    }
  }).on('readable', function() {
    // stdout stream is readable
  }).on('change', function() {
    console.log('changed server');
  }).on('restart', function() {
    //console.log('Rerunning tests...');
    // server has restarted
  });
  */
});

/* Running server */
gulp.task('default', function() {
  gulp.run(['start-server','ngrok']);
});
gulp.task('start-server', function() {
  process.env.PORT = '5000';
  exec('supervisor index.js');
});
