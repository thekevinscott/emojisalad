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

  child.slaughter = () => {
    return new Promise((resolve) => {
      const pid = child.pid;
      //console.log(pid);
      child.on('close', (code, signal) => {
        //console.log('IVE BEEN CLOSED', code, signal, pid, args);
        if ( close ) {
          close(code, signal);
        }
        resolve();
      });
      child.stdin.pause();
      child.kill();
    });
  };

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
    config.database
  ].join(" ");
}

function pullDB(config, tmp, tables) {
  const file = 'db_backup.sql';
  const zippedFile = 'db_backup.sql.gz';

  if ( ! tables ) {
    tables = [];
  }

  const parsed_tables = tables.reduce((obj, table) => {
    console.log('table', table);
    if ( table.data === false ) {
      obj['tables_without_data'].push(table.table);
    } else {
      if ( table.table ) {
        obj['tables_with_data'].push(table.table);
      } else {
        obj['tables_with_data'].push(table);
      }
    }
    return obj;
  }, { tables_without_data: [], tables_with_data: [] });
  const tables_without_data = parsed_tables['tables_without_data'];
  const tables_with_data = parsed_tables['tables_with_data'];

  console.log('tables with data', tables_with_data);
  console.log('tables without data', tables_without_data);

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
  return exec('mkdir -p '+tmp).then(() => {
    return exec('rm -f '+tmp+file);
  }).then(() => {
    if ( tables_without_data.length ) {
      console.log('dumping schemas');
      console.log(dumpSchemas.join(' '));
      return exec(dumpSchemas.join(' '));
    }
  }).then(() => {
    if ( tables_with_data.length ) {
      console.log('dumping data');
      return exec(dumpData.join(' '));
    }
  }).then(() => {
    console.log('gunzipping');
    return exec('gunzip '+tmp+zippedFile);
  }).then(() => {
    console.log(tmp+file);
    return tmp+file;
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function importDB(config, file) {
  //console.log('got file', file);
  const importDB = [
    'mysql',
    getConnectionString(config),
    '<',
    file
  ];
  //console.log(importDB.join(' '));
  return exec(importDB.join(' ')).catch((e) => {
    console.error('error', e);
  });
}

const server = (options) => {
  return () => {
    const DEBUG = options.DEBUG || util.env.DEBUG || 'true';
    const PORT = options.PORT || util.env.PORT || '1338';
    const ENVIRONMENT = options.ENVIRONMENT || util.env.ENVIRONMENT || 'development';

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
      `PORT=${PORT}`
    ].concat(Object.keys(options).map((key) => {
      return `${key.toUpperCase()}=${options[key]}`;
    }));

    const child = spawn('env', args.concat([
      cmd,
      'index.js'
    ]), (data) => {
      const color = 'yellow';
      //console.log(chalk.green('heyo'));
      console.log(chalk[color](`${data}`));
    }, (err) => {
      console.error(`${err}`);
    });

    //console.log('CHILD PID', child.pid, options);
    process.on('exit', () => {
      //console.log('WHOAA HORSEY kill that child', child.pid, options);
      child.stdin.pause();
      child.kill('SIGKILL');
    });

    //console.log('return a child for', options);
    return child;
  };
};

module.exports.exec = exec;
module.exports.getConnectionString = getConnectionString;
module.exports.pullDB = pullDB;
module.exports.importDB = importDB;
module.exports.spawn = spawn;
module.exports.server = server;
