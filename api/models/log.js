'use strict';
const Promise = require('bluebird');
const squel = require('squel');
const db = require('db');
const Player = require('./player');
const _ = require('lodash');
 
var Log = {
  incoming: function(response) {
    return Player.get({ number: response.From, to: response.To }).then(function(player) {
      try {

      var query = squel
                  .insert()
                  .into('incomingMessages') 
                  .setFields({
                    message: response.Body,
                    response: JSON.stringify(response),
                    created: squel.fval('NOW(3)')
                  });


      if ( player ) {
        query.setFields({
          player_id: player.id,
          player_state: player.state_id
        });
      }
      
      return db.query(query);
      } catch(e) {
        // fail relatively silently
        console.error('error inserting into DB', query.toString());
      }
    });
  },
  outgoing: function(responses) {
    try {
      if ( !_.isArray(responses) ) {
        responses = [responses];
      }
      if ( responses && responses.length ) {
        Promise.all(responses.map(function(message) {
          return Player.get({ id: message.player.id }).then(function(player) {

            var query = squel
                        .insert()
                        .into('outgoingMessages')
                        .setFields({
                          message_key: message.key,
                          options: JSON.stringify(message.options || []),
                          message: message.message,
                          type: message.type,
                          created: squel.fval('NOW(3)')
                        });

            query.setFields({
              player_id: player.id,
              player_state: player.state_id,

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
