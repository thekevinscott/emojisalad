'use strict';
const mysql = require('mysql');
const Promise = require('bluebird');
const squel = require('squel');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
let pool;

if ( ! process.env.ENVIRONMENT ) {
  throw "You must specify a DB environment";
}

squel.registerValueHandler(Date, function(date) {
  return '"' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '"';
});

let config = require('../config/db')[process.env.ENVIRONMENT];

if ( ! pool ) {
  pool  = mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    charset  : config.charset,
    database : config.database,
    connectionLimit: 10,
  });
}

function getConnection() {
  return pool.getConnectionAsync();
}

let db = {
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

module.exports = db;
