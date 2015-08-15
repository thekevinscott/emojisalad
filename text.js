var config = require('./config/twilio');
var _ = require('lodash');

var client = require('twilio')(config.accountSid, config.authToken); 
 
function send(to, data) {
    var params = {
        to: to, 
        from: config.from, 
    };

    if ( _.isObject(data) ) {
        if ( data.msg ) {
            params.body = data.msg;
        }
        if ( data.url ) {
            params.mediaUrl = data.url;
        }
    } else {
        params.body = data.msg;
    }

    return client.messages.post(params);
}

function get(sid) {
    if ( sid ) {
        return client.messages(sid).get();
    } else {
        return client.messages.list();
    }
}

function reply(messages) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    messages.map(function(message) {
        twiml.message(message);
    });
    return twiml;
}

module.exports = {
    send: send,
    get: get,
    reply: reply
}
