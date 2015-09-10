var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');
var User = require('./user');
var Message = require('./message');
 
var Log = {
  incoming: function(response, platform) {
    return User.get({ number: response.From }).then(function(user) {
      try {
        var platform_id = squel
                          .select()
                          .field('id')
                          .from('platforms')
                          .where('platform=?',platform);
        platform_id = 1;

      var query = squel
                  .insert()
                  .into('incomingMessages') 
                  .setFields({
                    message: response.Body,
                    response: JSON.stringify(response),
                    platform_id: platform_id,
                    created: squel.fval('NOW(3)')
                  });


      if ( user ) {
        query.setFields({
          user_id: user.id,
        });
      }
      
      return db.query(query);
      } catch(e) {
        // fail relatively silently
        console.error('error inserting into DB', query.toString());
      }
    });
  },
  outgoing: function(responses, user, platform) {
    /// IM TRACKING OUTGOING MESSAGES HERE
    try {
    if ( responses && responses.length ) {
      Promise.all(responses.map(function(message) {
        var platform_id = squel
                          .select()
                          .field('id')
                          .from('platforms')
                          .where('platform=?',platform);

        platform_id = 1;

        var query = squel
                    .insert()
                    .into('outgoingMessages')
                    .setFields({
                      message_key: message.key,
                      options: JSON.stringify(message.options || []),
                      message: message.message,
                      type: message.type,
                      platform_id: platform_id,
                      created: squel.fval('NOW(3)')
                    });

                    console.log(query.toString());
        if ( message.type === 'respond' && user ) {
          query.setFields({ user_id: user.id });
        } else if ( message.user ) {
          query.setFields({ user_id: message.user.id });
        }

        return db.query(query);
      }));
    }
    } catch(e) {
      console.error('error with outgoing message', e);
    }
  }
}

module.exports = Log;
