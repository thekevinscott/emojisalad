'use strict';
const Promise = require('bluebird');
const childExec = require('child_process').exec;
const chalk = require('chalk');
const util = require('gulp-util');
const childSpawn = require('child_process').spawn;

function spawn(command, args, stdout, stderr, close) {
  // Run `gulp` command
  const child = childSpawn(command, args);

  if ( stdout ) {
    child.stdout.on('data', (data) => {
      stdout(data, command, args);
    });
  }

  if ( stderr ) {
    child.stderr.on('data', (data) => {
      stderr(data, command, args);
    });
  }

  if ( close ) {
    child.on('close', (data) => {
      close(data, command, args);
    });
  }

  return child;
}

function exec(command, callbacks) {
  if ( ! callbacks ) {
    callbacks = {};
  }
  return new Promise((resolve, reject) => {
    //console.log('starting', command);
    return childExec(command, (error, stdout, stderr) => {
      //console.log('back, for', command);
      if ( error ) {
        if ( callbacks.error ) {
          callbacks.error(error);
        }
        reject(error);
      } else if ( stderr && stderr.indexOf('Warning') === -1 ) {
        if ( callbacks.stderr ) {
          callbacks.stderr(stderr);
        }
        reject(stderr);
      } else {
        if ( callbacks.stdout ) {
          callbacks.stdout(stdout);
        }
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

function server(options) {
  return function() {
    const DEBUG = util.env.DEBUG || 'true';
    const PORT = util.env.PORT || '1338';
    const ENVIRONMENT = util.env.ENVIRONMENT || 'development';

    if ( ! options ) {
      options = {};
    }

    let cmd = 'node';
    if (util.env.WATCH) {
      cmd = 'supervisor';
    }

    const args = [
      `ENVIRONMENT=${ENVIRONMENT}`,
      `DEBUG=${DEBUG}`,
      `PORT=${PORT}`,
    ].concat(Object.keys(options).map(function(key) {
      return `${key.toUpperCase()}=${options[key]}`;
    }));

    return spawn('env', args.concat([
      cmd,
      'index.js',
    ]),
    (data) => {
      let color = 'yellow';
      //console.log(chalk.green('heyo'));
      console.log(chalk[color](`${data}`));
    },
    (err) => {
      console.error(`${err}`);
    });
  }
}

module.exports.exec = exec;
module.exports.getConnectionString = getConnectionString;
module.exports.pullDB = pullDB;
module.exports.importDB = importDB;
module.exports.spawn = spawn;
module.exports.server = server;
