var _ = require('lodash');
var Q = require('q');

var squel = require('squel');

var db = require('db');
var User = require('./user');
 
var Log = {
  incoming: function(response) {
    return User.get(response.From).then(function(users) {
      var query = squel
              .insert()
              .into('incomingMessages');

      if ( users.length ) {
        var user = users[0];
        query.setFields({
          user_id: user.id,
          phone: response.From,
          message: response.Body,
          response: JSON.stringify(response)
        });
      } else {
        query.setFields({
          phone: response.From,
          message: response.Body,
          response: JSON.stringify(response)
        });
      }
      
      console.log('query', query.toString());
      db.query(query);
    }).fail(function(err) {
      console.error('error getting user id when saving response', err);
    });
  }
}

module.exports = Log;
