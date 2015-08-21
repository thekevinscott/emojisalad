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
  var dumpDB = [
    'mysqldump -u',
    config.production.user,
    '-p' + config.production.password,
    '-h',
    config.production.host,
    config.production.database,
    '|',
    'gzip >',
    tmp+zippedFile
  ];
  return exec('mkdir -p '+tmp).then(function() {
    return exec('rm -f '+tmp+file);
  }).then(function() {
    return exec(dumpDB.join(' '))
  }).then(function(output) {
    return exec('gunzip '+tmp+zippedFile);
  }).then(function() {
    return tmp+file;
  });
}

gulp.task('sync', function(cb) {
  var tmp = 'tmp/';
  var config = require('db').config;
  var importConfig;
  var keys = Object.keys(argv);
  var importKey;
  for ( var i=0, l = keys.length; i<l;i++ ) {
    var val = keys[i];
    if ( config[val] ) {
      importKey = val;
      break;
    }
  };
  if ( importKey === 'production' ) {
    throw "WHOA WHOA WHOA NO KILLING PRODUCTION";
  } else {
    importConfig = config[importKey];
  }
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
gulp.task('sync-testing-db', function() {
  var tmp = 'tmp/';
  var config = require('db').config;
  importConfig = config['kevin-test'];
  var testDB = 'test/fixtures/test-db.sql';
  pullDB().then(function(file) {
    return exec(['rm -f',testDB].join(' ')).then(function() {
      return exec(['mv',file,testDB].join(' '));
    });
  }).catch(function(e) {
    console.log('e', e);
  }).done(function() {
    exec('rm -rf '+tmp).then(function() {
      process.exit(0);
    });
  });
});
gulp.task('mocha', function() {
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
  .pipe(mocha({}))
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
