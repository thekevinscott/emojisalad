var Q = require('q');
var squel = require('squel');

var db = require('db');

var Message = {
  table: 'messages',
  get: function(key) {
    var query = squel
                .select()
                .from(this.table)
                .where('`key`=?',key);
                console.log(query.toString());
    return db.query(query).then(function(messages) {
      return messages[0];
    });
  }
};

module.exports = Message;
