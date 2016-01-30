'use strict';
const mysql = require('mysql');
const Promise = require('bluebird');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

function getPool(config) {

  mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    charset  : config.charset,
    database : config.database,
    connectionLimit: 10,
  });

  function getConnection() {
    return pools[key].getConnectionAsync();
  }

  const db = {
    query: function(sql) {
      return getConnection().then(function(conn) {
        let args = [];
        if ( typeof(sql) === 'string' ) {
          args.push(sql);
        } else {
          const param = sql.toParam();
          args.push(param.text);
          args.push(param.values);
        }

        return conn.queryAsync.apply(conn,args).then(function(rows) {
          return rows[0];
        }).catch(function(err) {
          if ( err ) {
            switch(err.errno) {
              // dup entry
            case 1062:
              return null;
            default: 
              if ( typeof(sql) === 'string' ) {
                err.sql = sql;
              } else {
                err.sql = {
                  string: sql.toString(),
                  params: sql.toParam()
                };
              }
              break;
            }
          }
          throw err;
        }).finally(function() {
          conn.release();
        });
      });
    }
  };
}

let pools = new Map();

function getDB(config) {
  if (!pools.get(config)) {
    console.log('pool does not exist for ',config.host);
    pools.set(config, getPool(config));
  } else {
    console.log('pool already exists for ',config.host);
  }
  return pools.get(config);
}

module.exports = getDB;
