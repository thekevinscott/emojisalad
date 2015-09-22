'use strict';
var db = require('../db');
var Promise = require('bluebird');
var squel = require('squel');

function getMessages(user_id) {
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
                              .field('m.created')
                              .field('m.message')
                              .from('outgoingMessages', 'm')
                              .left_join('users', 'u', 'u.id=m.user_id')
                              .left_join('platforms', 'p', 'p.id=m.platform_id')
                              .left_join(attributes, 'a', 'a.user_id=u.id')
                              .where('u.id=?',user_id)
                              .order('m.created', false);
                              
  var get_incoming_messages = squel
                              .select()
                              .field('m.id')
                              .field('a.username')
                              .field('m.created')
                              .field('m.message')
                              .from('incomingMessages', 'm')
                              .left_join('users', 'u', 'u.id=m.user_id')
                              .left_join('platforms', 'p', 'p.id=m.platform_id')
                              .left_join(attributes, 'a', 'a.user_id=u.id')
                              .where('u.id=?',user_id)
                              .order('m.created', false);
                              
                              console.log(get_incoming_messages.toString());
  return Promise.join(
    db.query(get_incoming_messages.toString()),
    db.query(get_outgoing_messages.toString()),
    function(incoming, outgoing) {
      console.log(incoming);
      return incoming.map(function(message) {
        message.type = 'incoming';
        return message;
      }).concat(outgoing.map(function(message) {
        message.type = 'outgoing';
        return message;
      })).sort(function(a, b) {
        return a.created > b.created ? 1 : -1;
      });
    }
  );
}

module.exports = getMessages;
