var squel = require('squel');
var sprintf = require('sprintf');

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
  }
};

module.exports = Message;
