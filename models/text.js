var config = require('../config/twilio');
var _ = require('lodash');
var Q = require('q');
var sprintf = require('sprintf');

var squel = require('squel');

var db = require('db');

var client = require('twilio')(config.accountSid, config.authToken); 
 
var User = require('./user');
//var Message = require('./message');

//function get(sid) {
    //if ( sid ) {
        //return client.messages(sid).get();
    //} else {
        //return client.messages.list();
    //}
//}

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
    console.log('send to ', user);
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
        return Q.reject('An unknown error occurred; please try again later.');
      } else {
        var message = messages[0];
        
        params.body = sprintf.apply(null, [message.message].concat(message_options));

        return client.messages.post(params).then(function(response) {
          this.saveMessage(user, message.id, params.body, response);
          // we don't wait for the db call to finish,
          // this can fail and we still want to proceed
          return response;
        }.bind(this));
      }
    }.bind(this));

  },
  saveMessage: function(userData, message_id, message, response) {
    //console.log('save message');
    return User.get(userData).then(function(users) {
      if ( users.length ) {
        var user = users[0];

        // lets do a check that the number returned from twilio
        // matches the number we thought it was. its possible twilio
        // has changed the number to match its internal specifications.
        User.updatePhone(response.to, user);

        var query = squel
                    .insert()
                    .into(this.table)
                    .setFields({
                      user_id: user.id,
                      message: message,
                      message_id: message_id,
                      response: JSON.stringify(response)
                    });
                    //console.log('save message query: ' , query.toString());
        return db.query(query);
      } else {
      }

    }.bind(this));

  },
  saveResponse: function(response) {
    return User.get(response.From).then(function(users) {
      var query = squel
              .insert()
              .into('replies');

      if ( users.length ) {
        var user = users[0];
        query.setFields({
          user_id: user.id,
          phone: response.From,
          message: response.Body,
          response: JSON.stringify(response)
        });
      } else {
        query.setFields({
          phone: req.body.From,
          message: req.body.Body,
          response: JSON.stringify(req.body)
        });
      }
      console.log('query to save', query.toString());
      db.query(query);
    }).fail(function(err) {
      console.error('error getting user id when saving response', err);
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
