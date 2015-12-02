'use strict';
const squel = require('squel');
const sprintf = require('sprintf');
const _ = require('lodash');
const Promise = require('bluebird');
const db = require('db');
//const config = require('../../config/twilio')[process.env.ENVIRONMENT];

let Message = {
  get: Promise.coroutine(function* (key, options, arr) {
    if ( ! options ) {
      options = [];
    }
    if ( typeof key === 'string' ) {
      key = [key];
    }

    var query = squel
                .select()
                .from('messages')
                .where('`key` IN ?',key);

    let messages = yield db.query(query);
    if ( messages.length ) {
      // the new way expects an options argument 
      // that is an object containing keys
      // that correspond to a message's key.
      //
      // so, the new way's options would be:
      // {
      //  intro_4: [
      //    '8604601234'
      //  ]
      // }
      //
      // the old way just expects an options array
      // [ '8604601234' ]
      if ( 0 || !arr ) {
        throw "Don't use this way any more";
        //console.log('==== old way', options);
        //var message = messages[0];
        //message.message = sprintf.apply(null, [message.message].concat(options));
        //return message;
      } else {
        return messages.map(function(obj) {
          if ( options[obj.key] ) {
            obj.message = sprintf.apply(null, [obj.message].concat(options[obj.key]));
          }
          return obj;
        });
      }

    } else {
      throw "No messages found for key " + key;
    }
  }),
  parse: Promise.coroutine(function* (responses) {
    if ( responses && responses.length ) {
      var messages = {};
      var options = {};
      responses.map(function(response) {
        if ( response.options ) {
          options[response.key] = response.options;
        }
      });

      let rows = yield Message.get(responses.map(function(response) {
        if ( ! response.key ) {
          throw new Error("Every response must have a key: " + JSON.stringify(response));
        }
        return response.key;
      }), options, 1);

      rows.map(function(row) {
        messages[row.key] = row.message;
      });

      return responses.map(function(response) {
        let to;
        let from;
        //if ( ! response.player || ! response.player.number ) {
          //console.error('##### deprecate passing number directly', response);
          //throw "stop it";
        //} else {
          //to = response.player.from;
        //}

        if ( response.player.from ) {
          from = response.player.from;
        } else if ( response.player.user.from ) {
          from = response.player.user.from;
        }
        to = response.player.to;

        if ( ! to ) {
          console.error(response);
          throw "Missing to field in Message.parse";
        }

        if ( ! from ) {
          console.error(response);
          throw "Missing from field in Message.parse";
        }

        // The 'to' and 'from fields get flipped.
        // i.e., a user's number, which until now
        // was the 'from' field, is now the number
        // we send to, aka the 'to' field.
        return _.assign({
          message: messages[response.key],
          to: from,
          from: to
        }, response);
      });
    } else {
      return [];
      //return new Promise(function(resolve) {
        //resolve([]);
      //});
    }
  })
};

module.exports = Message;
