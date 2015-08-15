var Q = require('q');
// Twilio Credentials 
var accountSid = 'ACe1033942b378b846fa69be0a58f04778'; 
var authToken = '0b2a36fbb7cb1c6f558163f5fd61f081'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var from = "12039412722";
 
function send(to, msg) {
    var dfd = Q.defer();
    client.messages.create({ 
        to: to, 
        from: from, 
        body: msg
    }, function(err, message) { 
        if ( err ) {
            dfd.reject(err);
        } else {
            dfd.resolve(message);
        }
    });
    return dfd.promise;
}

function get(sid) {
    var dfd = Q.defer();
    client.messages(sid).get(function(err, message) {
        if ( err ) {
            dfd.reject(err);
        } else {
            dfd.resolve(message);
        }
    });
    return dfd.promise;
}

function getAll() {

    var dfd = Q.defer();
    client.messages.list(function(err, message) {
        if ( err ) {
            dfd.reject(err);
        } else {
            dfd.resolve(message);
        }
    });
    return dfd.promise;
}

module.exports = {
    send: send,
    get: get
}

