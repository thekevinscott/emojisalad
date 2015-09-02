var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');
var User = require('./user');
var Message = require('./message');
 
var Log = {
  incoming: function(response) {
    return User.get({ number: response.From }).then(function(user) {
      try {
      var query = squel
                  .insert()
                  .into('incomingMessages') 
                  .setFields({
                    message: response.Body,
                    response: JSON.stringify(response)
                  });


      if ( user ) {
        query.setFields({
          user_id: user.id,
        });
      }
      
      return db.query(query);
      } catch(e) {
        // fail relatively silently
        console.log('error inserting into DB', query.toString());
      }
    });
  },
  outgoing: function(responses, user) {
    /// IM TRACKING OUTGOING MESSAGES HERE
    try {
    if ( responses && responses.length ) {
      //var options = 
        //responses.map(function(response) {
      //});
      //return Message.get(responses.map(function(response) {
        //return response.key;
      //}).then(function(messages) {
      //});
      Promise.all(messages.map(function(message) {
        console.log('message', message);
        var query = squel
                    .insert()
                    .into('outgoingMessages')
                    .setFields({
                      message_key: message.key,
                      options: JSON.stringify(message.options),
                      //message: 'foobar'
                    });

        if ( message.type === 'respond' && user ) {
          query.setFields({ user_id: user.id });
        } else if ( message.user ) {
          query.setFields({ user_id: message.user.id });
        }

        return db.query(query);
      }));
    }
    } catch(e) {
      console.log('error with outgoing message', e);
    }
  }
}

module.exports = Log;
