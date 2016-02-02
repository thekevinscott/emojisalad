'use strict';
const Promise = require('bluebird');
const childExec = require('child_process').exec;

function exec(command) {
  return new Promise((resolve, reject) => {
    return childExec(command, (error, stdout, stderr) => {
      if ( error ) {
        reject(error);
      } else if ( stderr && stderr.indexOf('Warning') === -1 ) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function getConnectionString(config) {
  return [
    "-u",
    config.user,
    "-p'" + config.password+"'",
    "-h",
    config.host,
    config.database,
  ].join(" ");
}

function pullDB(config, tmp, tables) {
  const file = 'db_backup.sql';
  const zippedFile = 'db_backup.sql.gz';

  if ( ! tables ) {
    tables = [];
  }

  const tables_without_data = tables.filter((table) => {
    if ( table.data === undefined ) {
      return table;
    } else if ( table.data !== true ) {
      return table.table;
    }
  });

  const tables_with_data = tables.map((table) => {
    if ( table.data ) {
      return table.table;
    }
  });

  const dumpSchemas = [
    'mysqldump',
    '--no-data',
    '--add-drop-table',
    getConnectionString(config),
    tables_without_data.join(' '),
    '|',
    'gzip >',
    tmp+zippedFile
  ];

  const dumpData = [
    'mysqldump',
    '--opt',
    getConnectionString(config),
    tables_with_data.join(' '),
    '|',
    'gzip >>',
    tmp+zippedFile
  ];
  return exec('mkdir -p '+tmp).then(function() {
    return exec('rm -f '+tmp+file);
  }).then(function() {
    if ( tables_without_data.length ) {
      console.log('dumping schemas');
      //console.log(dumpSchemas.join(' '));
      return exec(dumpSchemas.join(' '));
    }
  }).then(function() {
    if ( tables_with_data.length ) {
      console.log('dumping data');
      return exec(dumpData.join(' '));
    }
  }).then(function() {
    console.log('gunzipping');
    return exec('gunzip '+tmp+zippedFile);
  }).then(function() {
    console.log(tmp+file);
    return tmp+file;
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function importDB(config, file) {
  //console.log('got file', file);
  let importDB = [
    'mysql',
    getConnectionString(config),
    '<',
    file
  ];
  //console.log(importDB.join(' '));
  return exec(importDB.join(' ')).catch(function(e) {
    console.error('error', e);
  });
}

module.exports.exec = exec;
module.exports.getConnectionString = getConnectionString;
module.exports.pullDB = pullDB;
module.exports.importDB = importDB;
