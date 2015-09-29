'use strict';
const Promise = require('bluebird');
const squel = require('squel');
const db = require('db');
const User = require('./user');
const _ = require('lodash');
 
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
          user_state: user.state_id
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
    try {
      if ( !_.isArray(responses) ) {
        responses = [responses];
      }
      if ( responses && responses.length ) {
        Promise.all(responses.map(function(message) {
          return User.get({ id: message.user.id }).then(function(user) {
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

            query.setFields({
              user_id: user.id,
              user_state: user.state_id,

            });

            return db.query(query);
          });
        }));
      }
    } catch(e) {
      console.error('error with outgoing message', e);
    }
  }
};

module.exports = Log;
