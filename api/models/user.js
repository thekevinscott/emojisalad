var squel = require('squel').useFlavour('mysql');
var db = require('db');
var Game = require('./game');
var Promise = require('bluebird');
var Invite = require('./invite');
var Text;

var regex = require('../config/regex');

var User = {
  // valid phone number test
  table: 'users',

  // create a new user number
  create: function(user, entry, platform) {
    var attributes = {};

    var query = squel
                .insert()
                .into('users');

    if ( platform ) {
      query.setFields({'platform_id': squel
                    .select()
                    .field('id')
                    .from('platforms')
                    .where('platform=?', platform)});
    }

    if ( entry ) {
      query.setFields({'entry_id': squel
                                 .select()
                                 .field('id')
                                 .from('user_entries')
                                 .where('entry=?', entry)});
    }

    query.setFields({ 'state_id': squel
                                 .select()
                                 .field('id')
                                 .from('user_states')
                                 .where('state=?','waiting-for-confirmation')});

    return db.query(query.toString()).then(function(rows) {
      var user_id = rows.insertId;

      var attribute_id = squel
                         .select()
                         .field('id')
                         .from('user_attribute_keys')
                         .where('`key`=?','number');
      var attb = squel
                 .insert()
                 .into('user_attributes')
                 .setFields({
                   user_id: user_id,
                   attribute_id: attribute_id,
                   attribute: user['number']
                 });


       return db.query(attb.toString()).then(function() {
         user.id = user_id;
         return user;
       });
    });
  },
  get: function(user) {
    function fetchUser(key, val) {
      var query = squel
                  .select()
                  .field('u.id')
                  .field('u.created')
                  .field('i.inviter_id')
                  .field('p.platform', 'platform')
                  .field('s.state', 'state')
                  .from('users', 'u')
                  .left_join('invites', 'i', 'u.id = i.invited_id')
                  .left_join('platforms', 'p', 'p.id = u.platform_id')
                  .left_join('user_states', 's', 's.id = u.state_id')
                  .left_join('user_attributes', 'a', 'a.user_id = u.id')
                  .left_join('user_attribute_keys', 'k', 'a.attribute_id = k.id');
      if ( key === 'id' ) {
        query = query.where('u.`'+key+'`=?', val);
      } else if ( key === 'invited_id' ) {
        query = query.where('i.invited_id=?', val)
      } else {
        query = query
                .where('k.`key`=?', key)
                .where('a.attribute=?', val);
      }

      return db.query(query.toString()).then(function(users) {
        if ( ! users.length ) {
          return null;
        } else {

          var user = users[0];

          var promises = [
            function() {
              var query = squel
                          .select()
                          .field('a.attribute')
                          .field('k.`key`')
                          .from('user_attributes', 'a')
                          .left_join('users', 'u', 'u.id = a.user_id')
                          .left_join('user_attribute_keys', 'k', 'k.id = a.attribute_id')
                          .where('a.user_id=?',user.id);

              return db.query(query);
            }(),
          ];

          if ( user.inviter_id ) {
            promises.push(User.get({ id: user.inviter_id }));
          }

          return Promise.all(promises).then(function(results) {
            results[0].map(function(attribute) {
              user[attribute.key] = attribute.attribute;
            });
            if ( results[1] ) {
              user.inviter = results[1];
            }
            //user.game = game;
            return user;
          });

        }
      });
    }

    if ( typeof user === 'object' ) {
      if ( user.id ) {
        return fetchUser('id', user.id);
      } else if ( user.number ) {
        return fetchUser('number', user.number);
      } else if ( user['messenger-name'] ) {
        return fetchUser('messenger-name', user['messenger-name']);
      } else if ( user.nickname ) {
        return fetchUser('nickname', user.nickname);
      } else if ( user.invited_id ) {
        return fetchUser('invited_id', user.invited_id);
      } else {
        throw new Error({
          message: 'Tried to select on an invalid user key'
        });
      }
    } else {
      // we've passed a number
      return fetchUser('number', user);
    }
  },
  update: function(user, params) {
    // a whitelisted array of arguments we're allowed to update

    var queries = [];

    Object.keys(params).map(function(key) {
      switch(key) {
        case 'state' :
          var state = squel
                       .select()
                       .field('id')
                       .from('user_states')
                       .where('state=?',params[key]);


          var query = squel
                      .update()
                      .table('users')
                      .where('id=?', user.id);
          query.set('state_id', state, { dontQuote: true });
          queries.push(db.query(query));
          break;
        default:
          var attribute_id = squel
                             .select()
                             .field('id')
                             .from('user_attribute_keys')
                             .where('`key`=?',key);
          var query = squel
                     .insert()
                     .into('user_attributes')
                     .setFields({
                       user_id: user.id,
                       attribute_id: attribute_id,
                       attribute: params[key]
                     })
                     .onDupUpdate('attribute', params[key]);

         queries.push(db.query(query.toString()));
          break;
      }
      user[key] = params[key];
    });

    return Promise.all(queries).then(function() {
      return user;
    });

    //return db.query(query).then(function(rows) {
      /*
        if ( params.state && params.state === 'ready-for-game' ) {
          console.log('**** YAY');
          // add them to the game
          Invite.getInviter(user.id).then(function(inviter) {
            console.log('inviters', inviter);
            if ( inviter && inviter.id ) {
              console.log('an inviter exists');
              return Game.getByUsers([inviter]).then(function(game) {
                console.log('got the game', game, user);
                return Game.add(game, [user]).then(function() {
                  dfd.resolve({
                    game_state: 'ready-to-play'
                  });
                });
              }).catch(function(err) {
                console.log('did not get the game');
                console.error(err);
              });
            } else {
              console.log('no inviter for user', user);
              return Game.getByUsers([user]).then(function(game) {
                if ( !game ) {
                  console.log('*****\n\n\n\n*******no game found either');
                  return Game.create().then(function(game) {
                    console.log('got game back', game);
                    return Game.add(game, [user]);
                  }).then(function() {
                    dfd.resolve({
                      game_state: 'pending'
                    });
                  });
                } else {
                  dfd.resolve({
                    game_state: 'foo'
                  });
                }
              });
            }
          });
        } else {

          dfd.resolve({
            game_state: 'pending'
          });
        }
        */
    //});
  },
  //this is the old message function that sends messages based on platform.
  //deprecated
  /*
  message: function(user, message_key, options) {
    console.log('where we doing', user, message_key);
    switch(user.platform) {
      case 'messenger': 

        console.log('prepare to send message');
        return Message.get(message_key, options).then(function(message) {
          if ( message && message.message ) {
            return message.message;
          } else {
            return new Error({
              message: 'Message for key not found: '+ message_key
            });
          }
        });
        break;
      case 'twilio':
        return Message.get(message_key, options).then(function(message) {
        if ( message && message.message ) {
          return message.message;
        } else {
          throw new Error({
            message: 'Message was not found for key: ' + message_key
          });
        }
      });
        break;
      default:
        return Q.reject('No platform specified');
        break;
    }
  }
  */
};

module.exports = User;
