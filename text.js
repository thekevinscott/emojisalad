// Twilio Credentials 
var accountSid = 'ACf2076b907d44abdd8dc8d262ff941ee4'; 
var authToken = '0d7b1b491ca038d4ff4fdf674cd46aa1'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
var from = "18603814834";
 
function send(to, msg) {
    return client.messages.create({ 
        to: to, 
        from: from, 
        body: msg
    });
}

function get(sid) {
    if ( sid ) {
        return client.messages(sid).get();
    } else {
        return client.messages.list();
    }
}

module.exports = {
    send: send,
    get: get
}
