var squel = require('squel');
var config = require('../config/twilio');
var sprintf = require('sprintf');
var _ = require('lodash');
var Promise = require('bluebird');

var db = require('db');

var Message = {
  table: 'messages',
  get: function(key, options, arr) {
    if ( ! options ) {
      options = [];
    }
    if ( typeof key === 'string' ) {
      key = [key];
    }

    var query = squel
                .select()
                .from(this.table)
                .where('`key` IN ?',key);

    return db.query(query).then(function(messages) {
      if ( messages.length ) {
        // THIS IS THE OLD WAY; DEPRECATED
        if ( !arr ) {
          var message = messages[0];
          message.message = sprintf.apply(null, [message.message].concat(options));
          return message;
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
    });
  },
  parse: function(responses) {
    if ( responses && responses.length ) {
      var messages = {};
      var options = {};
      //console.log('incoming responses', responses);
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
        return responses.map(function(response) {
          switch(response.type) {
            case 'sms' :
              if ( response.user ) {
                var number = response.user.number
              } else {
                console.log('##### deprecate passing number directly', response);
                var number = response.number;
              }

              //console.log('sms response', response, messages[response.key]);

              return _.assign({
                message: messages[response.key],
                to: number,
                from: config.from
              }, response);
            break;
            case 'respond' :
              return _.assign({
                message: messages[response.key],
              }, response);
            break;
            default:
              console.error('uncaught response type', response);
            break;
          }
        });
      });
    } else {
      return new Promise(function(resolve) {
        resolve([]);
      });
    }
  }
};

module.exports = Message;