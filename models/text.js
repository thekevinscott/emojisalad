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


var Text = {
  reply: function(responses) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    responses.map(function(response) {
      twiml.message(response.message);
    });
    return twiml;
  },
  sms: function(messages) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    messages.map(function(message) {
      twiml.sms(message.message, {
        number: message.number,
        from: config.from
      });
    });
    return twiml;
  },
  send: function send(user, message) {
    var params = {
      from: config.from
    };

    if ( typeof user !== 'object' ) {
      throw "You must now provide a user object";
    }

    console.log('user', user);
    params.to = user.number;
    params.body = message.message;


    console.log('prepare to send message');
    return client.messages.post(params).then(function(response) {
      console.log('sent message!');
      this.saveMessage(user, message.id, params.body, response);
      console.log('saved message');
      // we don't wait for the db call to finish,
      // this can fail and we still want to proceed
      return response;
    }.bind(this)).fail(function(err) {
      console.log('err', err);
      if ( err && err.code ) {
        switch(err.code) {
          case 21608:
            // this is an unverified number
            throw {
              errno: 6,
              message: 'this is an unverified number'
            }
          break;
          default:
            console.error('error when sending message', err);
            throw err;
          break;
        }
      } else {
        console.error('error when sending message', err);
        throw {
          message: err
        };
      }
    });
  },
  saveMessage: function(userData, message_id, message, response) {
    console.log('prepare to save message');
    console.log(userData, message_id, message);
    return User.get(userData).then(function(user) {
      if ( user ) {
        console.log('got a user');

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
}

module.exports = Text;
