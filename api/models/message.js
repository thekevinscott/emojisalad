var squel = require('squel');
var sprintf = require('sprintf');

var db = require('db');

var Message = {
  table: 'messages',
  get: function(key, options) {
    if ( ! options ) {
      options = [];
    }
    var query = squel
                .select()
                .from(this.table)
                .where('`key`=?',key);

    return db.query(query).then(function(messages) {
      if ( messages.length ) {
        var message = messages[0];
        message.message = sprintf.apply(null, [message.message].concat(options));
        return message;
      } else {
        throw "No messages found for key " + key;
      }
    });
  }
};

module.exports = Message;
