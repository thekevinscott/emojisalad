var Q = require('q');
var squel = require('squel');
var sprintf = require('sprintf');

var db = require('db');
var User = require('./user');

var Message = {
  table: 'messages',
  get: function(key, options) {
    if ( ! options ) {
      options = [];
    }
    var query = squel
                .select()
                .field('message')
                .from(this.table)
                .where('`key`=?',key);
                console.log(query.toString());
    return db.query(query).then(function(messages) {
      console.log('messages', messages);
      if ( messages.length ) {
        console.log('we have messages');
        return sprintf.apply(null, [messages[0].message].concat(options));
      } else {
        throw "No messages found for key " + key;
      }
    });
  }
};

module.exports = Message;
