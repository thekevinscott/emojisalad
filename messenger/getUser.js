var db = require('db');
var squel = require('squel');
var getMessages = require('./getMessages');
module.exports = function(user_id) {

  var attributes = squel
                   .select()
                   .field('a.attribute as username')
                   .field('a.user_id')
                   .from('user_attributes','a')
                   .left_join('user_attribute_keys','k','a.attribute_id=k.id')
                   .where('k.`key`=?','nickname');

  var query = squel
              .select()
              .field('u.id')
              .field('a.username')
              .from('users','u')
              .left_join(attributes, 'a', 'a.user_id=u.id')
              .where('u.id=?',user_id);

  return db.query(query.toString()).then(function(rows) {
    if ( rows.length ) {
      var user = rows[0];
      return getMessages(user_id).then(function(messages) {
        //console.log(messages);
        user.messages = messages;
        return user;
      });
    } else {
      return null;
    }
  });
}
