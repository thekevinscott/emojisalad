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
    if ( responses && responses.length ) {
      var messages = {};
      var options = {};
      console.log('incoming responses', responses);
      responses.map(function(response) {
        if ( response.options ) {
          options[response.key] = response.options;
        }
      });

      return Message.get(responses.map(function(response) {
        if ( ! response.key ) {
          throw new Error("Every response must have a key: " + JSON.stringify(response));
        }
        return response.key;
      }), options, 1).then(function(rows) {
        return rows.map(function(row) {
          //var key = row.key;
          //if ( ! messages[key] ) { messages[key] = {}; }
          messages[row.key] = row.message;
        });
      }).then(function() {
        console.log('all messages', messages);
        var twiml = new twilio.TwimlResponse();
        responses.map(function(response) {
          switch(response.type) {
            case 'sms' :
              if ( response.user ) {
                var number = response.user.number
              } else {
                console.log('##### deprecate passing number directly');
                var number = response.number;
              }

              console.log('sms response', response, messages[response.key]);

              twiml.sms(messages[response.key], {
                to: number,
                from: config.from
              });
            break;
            case 'respond' :
              twiml.message(messages[response.key]);
            break;
            default:
              console.error('uncaught response type', response);
            break;
          }
        });
        console.log('return twiml', twiml.toString());
        return twiml;
      });
    } else {
      return new twilio.TwimlResponse();
    }
  },
  /*
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
  */
  // DEPRECATED
  /*
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
  */
 /*
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
  */
 /*
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
  */
}

module.exports = Text;

