var mysql = require('mysql');
var connection;
if ( ! connection ) {
    connection = mysql.createConnection({
        host     : 'db.herdingpixels.com',
        user     : 'zdate',
        password : 'wgFkcma9b#zHkKoZRPXK9WVNH.p2U9'
    });
    connection.query('USE zdate2');
}

function getConnection(start) {
    function now() {
        return (new Date()).getTime();
    }
    var timeoutLimit = 6000;
    if ( ! start ) { start = now(); }
    if ( start < now() ) {
        console.log('check get Connection', parseInt((now() - start)/1000), 'seconds');
    }
    return new Promise(function(resolve, reject) {
        if ( connection ) {
            if ( start < now() ) {
                console.log('connection resolved');
            }
            resolve(connection);
        } else if ( start + timeoutLimit < now() ) {
            console.log('allowed attempts to connect to DB exceeded');
            reject('Error connecting to database');
        } else {
            setTimeout(function() {
                getConnection(start).then(function(conn) {
                    resolve(conn);
                }, function(err) {
                    reject(err);
                });
            }, 1000);
        }
    });
}

var db = {
    query: function(sql) {
        return new Promise(function(resolve, reject) {
            var param = sql.toParam();
            return getConnection().then(function(conn) {
                conn.query(param.text, param.values, function(err, rows) {
                    if (err) {
                        console.log('db error', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }, reject);
        });
    }
}

module.exports = db;
