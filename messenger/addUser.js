var db = require('db');
var Promise = require('bluebird');
var squel = require('squel');

function addUser (socket, user) {
  // we store the username in the socket session for this client
  socket.username = user.username;
  socket.user_id = user.user_id;
  socket.emit('login');
  // this could go get a list of messages

  var attributes = squel
                   .select()
                   .field('a.attribute as username')
                   .field('a.user_id')
                   .from('user_attributes','a')
                   .left_join('user_attribute_keys','k','a.attribute_id=k.id')
                   .where('k.`key`=?','nickname');

  var get_outgoing_messages = squel
                              .select()
                              .field('m.id')
                              .field('a.username')
                              .field('UNIX_TIMESTAMP(m.created) as created')
                              .field('m.message')
                              .from('outgoingMessages', 'm')
                              .left_join('users', 'u', 'u.id=m.user_id')
                              .left_join('platforms', 'p', 'p.id=m.platform_id')
                              .left_join(attributes, 'a', 'a.user_id=u.id')
                              .where('u.id=?',user.user_id)
                              .order('m.created', false);
                              
  var get_incoming_messages = squel
                              .select()
                              .field('m.id')
                              .field('a.username')
                              .field('UNIX_TIMESTAMP(m.created) as created')
                              .field('m.message')
                              .from('incomingMessages', 'm')
                              .left_join('users', 'u', 'u.id=m.user_id')
                              .left_join('platforms', 'p', 'p.id=m.platform_id')
                              .left_join(attributes, 'a', 'a.user_id=u.id')
                              .where('u.id=?',user.user_id)
                              .order('m.created', false);
                              
  return Promise.join(
    db.query(get_incoming_messages.toString()),
    db.query(get_outgoing_messages.toString()),
    function(incoming, outgoing) {
      var messages = incoming.concat(outgoing.map(function(message) {
        message.username = 'Emojibot';
        return message;
      })).sort(function(a, b) {
        console.log('a', a.created);
        return a.created > b.created ? 1 : -1;
      });
      console.log('messages', messages);
      socket.emit('response', messages);
    }
  );
}

module.exports = addUser;
