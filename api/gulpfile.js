var gulp = require('gulp');
var Promise = require('bluebird');
var childExec = require('child_process').exec;
var argv = require('yargs').argv;
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var env = require('gulp-env');
var nodemon = require('gulp-nodemon');
var chalk = require('chalk');

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

function pullDB() {
  var config = require('db').config;
  var tmp = 'tmp/';
  var destination = tmp+'production.sql.gz';
  var file = 'db_backup.sql';
  var zippedFile = 'db_backup.sql.gz';
  //mysqldump -u user -p --no-data db > structure.sql; mysqldump -u user -p db table1 table2 >> structure.sql

  var dumpSchemas = [
    'mysqldump -u',
    config.production.user,
    '-p' + config.production.password,
    '--no-data',
    '--add-drop-table',
    '-h',
    config.production.host,
    config.production.database,
    '|',
    'gzip >',
    tmp+zippedFile
  ];

  // these tables have data we want
  // and need
  var tablesHavingData = [
    'admins',
    'clues',
    'game_phrases',
    'game_states',
    'messages',
    'phrases',
    'platforms',
    'round_states',
    'user_attribute_keys',
    'user_entries',
    'user_states'
  ];
  var dumpData = [
    'mysqldump -u',
    config.production.user,
    '-p' + config.production.password,
    '-h',
    config.production.host,
    config.production.database,
    tablesHavingData.join(' '),
    '|',
    'gzip >>',
    tmp+zippedFile
  ];
  return exec('mkdir -p '+tmp).then(function() {
    return exec('rm -f '+tmp+file);
  }).then(function() {
    return exec(dumpSchemas.join(' '))
  }).then(function() {
    return exec(dumpData.join(' '))
  }).then(function(output) {
    return exec('gunzip '+tmp+zippedFile);
  }).then(function() {
    return tmp+file;
  });
}

gulp.task('sync', function(cb) {
  var tmp = 'tmp/';
  var importKey;
  var keys = Object.keys(argv);
  // environment is 1
  var importKey = keys[1];
  if ( importKey === 'production' ) {
    throw "WHOA WHOA WHOA NO KILLING PRODUCTION";
    return;
  } else {
    process.env.ENVIRONMENT = importKey;
  }
  var config = require('db').config;
  var importConfig;
  importConfig = config[importKey];

  pullDB().then(function(file) {
    var importDB = [
      'mysql -u',
      importConfig.user,
      '-p' + importConfig.password,
      '-h',
      importConfig.host,
      importConfig.database,
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

  process.env.ENVIRONMENT = 'kevin-test';
  process.env.PORT = '5005';
  var tmp = 'tmp/';
  var config = require('db').config;
  importConfig = config['kevin-test'];
  var testDB = 'test/fixtures/test-db.sql';
  return pullDB().then(function(file) {
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
  process.env.ENVIRONMENT = 'kevin-test';
  process.env.PORT = '5005';
  var db = 'test/fixtures/test-db.sql';
  var config = require('db').config['kevin-test'];
  var importDB = [
    'mysql -u',
    config.user,
    '-p' + config.password,
    '-h',
    config.host,
    config.database,
    '<'+ db
  ];
  return exec(importDB.join(' '));
}
function startServer(server) {
  if ( server === 'test' ) {
    process.env.ENVIRONMENT = 'kevin-test';
    process.env.PORT = '5005';
  } else {
    process.env.ENVIRONMENT = 'kevin-dev';
    process.env.PORT = '5000';
  }

  return nodemon({
    script: 'index.js',
    verbose: false,
    quiet: true,
    "events": {
      //"restart": "osascript -e 'display notification \"app restarted\" with title \"nodemon\"'"
    },
    env: {
      //ENVIRONMENT : 'kevin-test',
      //PORT : '5005'
    },
    stdout: false
  });
}
function runTests() {
  var deferred = Promise.pending();
  gulp.src(['test/index.js'], { read: false })
  .pipe(mocha({
    timeout: 60000
  }))
  .on('error', function(data) {
    console.log(data.message);
  })
  .once('end', function() {
    deferred.resolve();
  });
  return deferred.promise;
}
gulp.task('test', function(cb) {
  return startServer('test').on('start', function() {
    // process has started
  }).on('stderr', function(data) {
    data = data.toString().trim();
    console.error(chalk.red(data));
  }).on('stdout', function(data) {
    data = data.toString().trim();

    if ( data === 'EmojinaryFriend API' ) {
      resetTestingDB().then(function() {
        return runTests();
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
    console.log('Rerunning tests...');
    // server has restarted
  });
});

/* Running server */
gulp.task('default', function(cb) {
  gulp.run(['start-server','ngrok']);
});
gulp.task('start-server', function() {
  process.env.PORT = '5000';
  exec('supervisor index.js');
});
