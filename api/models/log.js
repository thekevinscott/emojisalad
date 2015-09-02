var _ = require('lodash');

var squel = require('squel');

var db = require('db');
var User = require('./user');
 
var Log = {
  incoming: function(response) {
    return User.get({ number: response.From }).then(function(user) {
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
    });
  },
  outgoing: function(messages) {
    /// IM TRACKING OUTGOING MESSAGES HERE
    // messages should pass along their options as well
    // messages should pass along their target user id as well
    if ( messages && messages.length ) {
      //return Promise.all(messages.map(function(message) {
        //console.log('message', message);
        //var query = squel
                    //.insert()
                    //.into('outgoingMessages')
                    //.setFields({
                      //user_id: '1',//message.user_id,
                      //message_id: message.id,
                      //options: JSON.stringify([])
                    //});
        //return db.query(query);
      //}()));
    }
  }
}

module.exports = Log;
