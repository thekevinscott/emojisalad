'use strict';
const mysql = require('mysql');
const Promise = require('bluebird');
const squel = require('squel');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
let pools = {};

if ( ! process.env.ENVIRONMENT ) {
  process.env.ENVIRONMENT = 'development';
  //throw "You must specify a DB environment";
}

let config = require('../config/db');

module.exports = getPool(process.env.ENVIRONMENT);
//module.exports.api = getPool('api');
//module.exports.test = getPool('test');

function getPool(key) {
  if ( ! pools[key] ) {
    const config_params = config[key];

    pools[key] = mysql.createPool({
      host     : config_params.host,
      user     : config_params.user,
      password : config_params.password,
      charset  : config_params.charset,
      database : config_params.database,
      connectionLimit: 10,
    });
  }

  function getConnection() {
    return pools[key].getConnectionAsync();
  }

  return {
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
