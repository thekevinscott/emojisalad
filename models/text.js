var config = require('../config/twilio');
var _ = require('lodash');
var Q = require('q');

var squel = require('squel');

var db = require('db');

var client = require('twilio')(config.accountSid, config.authToken); 
 
var User = require('./user');
var Message = require('./message');

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
  table: 'outgoingMessages',
  send: function send(user, message_key, message_options) {
    var params = {
      from: config.from
    };

    if ( typeof user === 'object' ) {
      console.log('user is an object', user);
      // then we've passed a user object
      params.to = user.number;
    } else {
      console.log('user is an string');
      // we've passed a phone number string
      params.to = user;
    }

    console.log('got messeage?');
    return Message.get(message_key, message_options).then(function(message) {
      params.body = message.message;

      return client.messages.post(params).then(function(response) {
        this.saveMessage(user, message.id, params.body, response);
        // we don't wait for the db call to finish,
        // this can fail and we still want to proceed
        return response;
      }.bind(this));
    }.bind(this));

  },
  saveMessage: function(userData, message_id, message, response) {
    return User.get(userData).then(function(users) {
      if ( users.length ) {
        var user = users[0];

        // lets do a check that the number returned from twilio
        // matches the number we thought it was. its possible twilio
        // has changed the number to match its internal specifications.
        //User.updatePhone(response.to, user);

        var query = squel
                    .insert()
                    .into('outgoingMessages')
                    .setFields({
                      user_id: user.id,
                      message: message,
                      message_id: message_id,
                      response: JSON.stringify(response)
                    });
        return db.query(query);
      } else {
        console.log('TODO: HANDLE THIS');
      }

    }.bind(this));

  },
  saveResponse: function(response) {
    return User.get(response.From).then(function(users) {
      var query = squel
              .insert()
              .into('incomingMessages');

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
          phone: response.From,
          message: response.Body,
          response: JSON.stringify(response)
        });
      }
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
          .into('outgoingMessages')
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
