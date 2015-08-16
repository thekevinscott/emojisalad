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

//function reply(messages) {
    //var twilio = require('twilio');
    //var twiml = new twilio.TwimlResponse();
    //messages.map(function(message) {
        //twiml.message(message);
    //});
    //return twiml;
//}

var Text = {
  table: 'texts',
  send: function send(user, message_id, message_options) {
    var params = {
      from: config.from
    };

    if ( typeof user === 'object' ) {
      // then we've passed a user object
      params.to = user.number;
    } else {
      // we've passed a phone number string
      params.to = user;
    }

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
          var user_id;
          if ( typeof user === 'object' ) {
            // then we've passed a user object
            user_id = user.id;
          } else {
            // we've passed a phone number string
            user_id = squel
                      .select()
                      .field('id')
                      .from('users')
                      .where('`number`=?', user);
          }

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
          // we don't wait for the db call to finish,
          // this can fail and we still want to proceed
          return response;
        }.bind(this));
      }
    }.bind(this));

  },
  saveResponse: function(response) {
    var query = squel
                .select()
                .field('id')
                .from('users')
                .where('`number`=?', response.From);
    return db.query(query).then(function(rows) {
      query = squel
              .insert()
              .into('replies');
      if ( rows.length ) {
        var user = rows[0];
        query.setFields({
          user_id: user.id,
          phone: response.From,
          message: response.Body,
          response: JSON.stringify(response)
        });
      } else {
        // we don't have this number in our database
        query.setFields({
          phone: req.body.From,
          message: req.body.Body,
          response: JSON.stringify(req.body)
        });
        db.query(query);
      }
    });

  },
  /*
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
  }
  */
}

module.exports = Text;
