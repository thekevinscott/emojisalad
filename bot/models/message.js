'use strict';
const squel = require('squel');
const sprintf = require('sprintf');
const _ = require('lodash');
const Promise = require('bluebird');
const db = require('db');
//const config = require('../../config/twilio')[process.env.ENVIRONMENT];

const Message = {
  get: (key, options) => {
    if ( ! options ) {
      options = [];
    }
    if ( typeof key === 'string' ) {
      key = [key];
    }

    const variants = squel
                     .select()
                     .from(
                       squel
                       .select()
                       .from('message_variants')
                       .order('rand()'), 'v2'
                     );
                     //.group('message_id');

    const query = squel
                  .select()
                  .field('m.id')
                  //.field('m.message', 'body')
                  .field('IFNULL(v.message, m.message)', 'body')
                  .field('m.`key`')
                  .from('messages', 'm')
                  .left_join(variants, 'v', 'm.id=v.message_id')
                  .where('`key` IN ?',key)
                  .order('RAND()');

    return db.query(query).then((messages) => {
      if ( messages.length ) {
        // expects an options argument
        // that is an object containing keys
        // that correspond to a message's key.
        //
        // {
        //  intro_4: [
        //    '8604601234'
        //  ]
        // }
        const messages_by_id = messages.reduce((reducedObj, obj) => {
          if ( obj.message ) {
            // this is coming from an old database
            obj.body = obj.message;
            delete obj.message;
          }
          if ( options[obj.key] ) {
            if ( _.isArray(options[obj.key]) ) {
              obj.body = sprintf(obj.body, ...options[obj.key]);
            } else {
              obj.body = sprintf(obj.body, options[obj.key]);
            }
          }

          if (! reducedObj[obj.id]) {
            reducedObj[obj.id] = {
              id: obj.id,
              key: obj.key,
              //name: obj.name
              body: obj.body,
              variants: [obj.body]
            };
          } else {
            reducedObj[obj.id].variants.push(obj.body);
          }
          return reducedObj;
        }, {});

        const messages_array = Object.keys(messages_by_id).map(message_id => messages_by_id[message_id]);

        return messages_array;
      } else {
        throw new Error("No messages found for keys " + key);
      }
    });
  },
  parse: (responses, original_message = {}) => {
    if ( responses && responses.length ) {
      const messages = {};
      const options = {};
      responses.map((response) => {
        if ( response.options ) {
          options[response.key] = response.options;
        }
      });

      return Message.get(responses.map((response) => {
        if ( ! response.key ) {
          throw new Error("Every response must have a key: " + JSON.stringify(response));
        }
        return response.key;
      }), options).then((rows) => {

        rows.map((row) => {
          messages[row.key] = row.body;
        });

        return responses.map((response) => {
          let from;

          const player = response.player;

          //console.info('response player', response);
          if ( player.from ) {
            from = player.from;
          } else if ( player.user && player.user.from ) {
            from = player.user.from;
          }
          const to = player.to;

          if ( ! to && player.protocol !== 'appqueue' ) {
            console.error(response);
            throw new Error("Missing to field in Message.parse");
          }

          if ( ! from ) {
            console.error(response);
            throw new Error("Missing from field in Message.parse");
          }

          // The 'to' and 'from fields get flipped.
          // i.e., a user's number, which until now
          // was the 'from' field, is now the number
          // we send to, aka the 'to' field.
          return _.assign({
            key: response.key,
            body: messages[response.key],
            to: from,
            from: to,
            protocol: player.protocol || original_message.protocol,
            initiated_id: original_message.id
          }, response);
        });
      });
    } else {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
  }
};

module.exports = Message;
