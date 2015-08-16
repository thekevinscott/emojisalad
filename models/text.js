var config = require('../config/twilio');
var _ = require('lodash');
var Q = require('q');
var sprintf = require('sprintf');

var squel = require('squel');

var db = require('db');

var client = require('twilio')(config.accountSid, config.authToken); 
 

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

var Text = {
  table: 'texts',
  send: function send(number, message_id, message_options) {
    var params = {
      to: number, 
      from: config.from, 
    };

    var query = squel
                .select()
                .from('messages')
                .where('`key`=?', message_id);

    return db.query(query).then(function(messages) {
      if ( ! messages.length ) {
        console.error('no messages found for', message_id);
        return Q.reject('An unknown error occurred; please try again later.');
      } else {
        var message = messages[0];
        
        params.body = sprintf.apply(null, [message.message].concat(message_options));

        return client.messages.post(params).then(function(response) {

          var user_id = squel
                        .select()
                        .from('users')
                        .field('id')
                        .where('number LIKE ?', number);

          var query = squel
                      .insert()
                      .into(this.table)
                      .setFields({
                        user_id: user_id,
                        message: message.message,
                        message_id: message.id,
                        response: JSON.stringify(response)
                      });

          db.query(query.toString());
        }.bind(this));
      }
    }.bind(this));

  },
  // just take the data object with body defined, or mediaUrl
  sendRaw: function send(to, data) {
    var params = _.extend({
      to: to, 
      from: config.from, 
    }, data);

    var query = squel
                .insert()
                .into(this.table)
                .setFields({
                  user_id: 1,
                  message: 1,
                  message_id: 1
                });

    db.query(query);

    return client.messages.post(params);
  },
  get: get,
  reply: reply
}

module.exports = Text;
