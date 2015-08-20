var gulp = require('gulp');
var childExec = require('child_process').exec;
var Promise = require('bluebird');
var argv = require('yargs').argv;


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
  for ( var i=0, l = keys.length; i<l;i++ ) {
    var val = keys[i];
    if ( config[val] ) {
      importConfig = config[val];
      break;
    }
  };
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
    return exec(dumpDB.join(' '))
  }).then(function(output) {
    return exec('gunzip '+tmp+zippedFile);
  }).then(function(output) {
    return exec(importDB.join(' '));
  }).catch(function(e) {
    console.log('e', e);
  }).done(function() {
    exec('rm -rf '+tmp).then(function() {
      process.exit(0);
    });
  });
});
