var mysql = require('mysql');
var Q = require('q');
var connection;
var config = require('./config/db');
if ( ! connection ) {
  connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password
  });
  connection.query('USE ' + config.database);
}

function getConnection(start) {
  function now() {
    return (new Date()).getTime();
  }
  var timeoutLimit = 6000;
  if ( ! start ) { start = now(); }
  if ( start < now() ) {
    //console.log('check get Connection', parseInt((now() - start)/1000), 'seconds');
  }
  var dfd = Q.defer();

  //console.log('conn?');
  if ( connection ) {
    if ( start < now() ) {
      //console.log('connection resolved');
    }
    dfd.resolve(connection);
  } else if ( start + timeoutLimit < now() ) {
    //console.log('allowed attempts to connect to DB exceeded');
    dfd.reject('Error connecting to database');
  } else {
    setTimeout(function() {
      getConnection(start).then(function(conn) {
        dfd.resolve(conn);
      }, function(err) {
        dfd.reject(err);
      });
    }, 1000);
  }
  return dfd.promise;
}

var db = {
  query: function(sql) {
    return getConnection().then(function(conn) {
      var dfd = Q.defer();
      function callback(err, data) {
        if (err) {
          switch(err.errno) {
            // dup entry
            case 1062:
              break;
            default: 
              console.error('db error', err);
            break;
          }
          dfd.reject(err);
        } else {
          dfd.resolve(data);
        }
      }
      if ( typeof(sql) === 'string' ) {
        conn.query(sql, callback);
      } else {
        var param = sql.toParam();
        conn.query(param.text, param.values, callback);
      }
      return dfd.promise;
    });
  }
}

module.exports = db;
