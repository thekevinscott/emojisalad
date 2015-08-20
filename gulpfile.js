var gulp = require('gulp');
var childExec = require('child_process').exec;
var Promise = require('bluebird');
var argv = require('yargs').argv;
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var env = require('gulp-env');

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

gulp.task('sync', function(cb) {
  var config = require('db').config;
  var tmp = 'tmp/';
  var destination = tmp+'production.sql.gz';
  var file = 'db_backup.sql';
  var zippedFile = 'db_backup.sql.gz';
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
  var importDB = [
    'mysql -u',
    importConfig.user,
    '-p' + importConfig.password,
    '-h',
    importConfig.host,
    importConfig.database,
    '<'+ tmp+file
  ];
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
  exec('mkdir -p '+tmp).then(function() {
    return exec('rm -f '+tmp+file);
  }).then(function() {
    return exec(dumpDB.join(' '))
  }).then(function(output) {
    return exec('gunzip '+tmp+zippedFile);
  }).then(function(output) {
    return exec(importDB.join(' '));
  }).catch(function(e) {
    console.log('e', e);
  }).done(function() {
    //exec('rm -rf '+tmp).then(function() {
      process.exit(0);
    //});
  });
});


/*
 * Testing Tasks
 */
gulp.task('mocha', function() {
  process.env.ENVIRONMENT = 'kevin-dev';
  return gulp.src(['test/index.js'], { read: false })
  .pipe(mocha({}))
  .on('error', gutil.log);
});
gulp.task('reset-testing-db', function() {
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
});
gulp.task('test', function(cb) {
  gulp.run(['reset-testing-db','mocha']);
  gulp.watch(['**'], ['mocha', 'reset-testing-db']);
});
