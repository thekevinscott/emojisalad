var config = require('../config/twilio');
var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');

var client = require('twilio')(config.accountSid, config.authToken); 
 
var User = require('./user');
var Message = require('./message');

var twilio = require('twilio');
//function get(sid) {
    //if ( sid ) {
        //return client.messages(sid).get();
    //} else {
        //return client.messages.list();
    //}
//}


var Text = {
  respond: function(responses) {
    var twiml = new twilio.TwimlResponse();
    var promises = [];
    if ( responses && responses.length ) {
      promises = responses.map(function(response) {
        return function() {
          switch(response.type) {
            case 'sms' :
              twiml.sms(response.message, {
                to: response.number,
                from: config.from
              });
            break;
            case 'respond' :
              twiml.message(response.message);
            break;
            default:
              console.error('uncaught response type', response);
            break;
          }
        }();
      });
    }

    return Promise.all(promises).then(function() {
      return twiml;
    });
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
  // DEPRECATED
  send: function send(user, message) {
    return;
    var params = {
      from: config.from
    };

    if ( typeof user !== 'object' ) {
      throw "You must now provide a user object";
    }

    //console.log('user', user);
    params.to = user.number;
    params.body = message.message;


    //console.log('prepare to send message');
    return client.messages.post(params).then(function(response) {
      //console.log('sent message!');
      this.saveMessage(user, message.id, params.body, response);
      //console.log('saved message');
      // we don't wait for the db call to finish,
      // this can fail and we still want to proceed
      return response;
    }.bind(this)).fail(function(err) {
      //console.log('err', err);
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
    //console.log('prepare to save message');
    //console.log(userData, message_id, message);
    return User.get(userData).then(function(user) {
      if ( user ) {
        //console.log('got a user');

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

