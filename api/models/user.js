'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
let Game;

let User = {
  // valid phone number test
  table: 'users',

  // create a new user number
  create: function(user, entry, platform) {
    var query = squel
                .insert()
                .into('users')
                .setFields({
                  created: squel.fval('NOW(3)')
                });

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
                   attribute: user.number
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
                  .field('u.state_id')
                  .field('i.inviter_id')
                  .field('p.platform', 'platform')
                  .field('s.state', 'state')
                  .from('users', 'u')
                  .where('u.archived=0')
                  .left_join('invites', 'i', 'u.id = i.invited_id')
                  .left_join('platforms', 'p', 'p.id = u.platform_id')
                  .left_join('user_states', 's', 's.id = u.state_id')
                  .left_join('user_attributes', 'a', 'a.user_id = u.id')
                  .left_join('user_attribute_keys', 'k', 'a.attribute_id = k.id');
      if ( key === 'id' ) {
        query = query.where('u.`'+key+'`=?', val);
      } else if ( key === 'invited_id' ) {
        query = query.where('i.invited_id=?', val);
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
      var query;
      switch(key) {
        case 'state' :
          let state = squel
                       .select()
                       .field('id')
                       .from('user_states')
                       .where('state=?',params[key]);


          query = squel
                  .update()
                  .table('users', 'u')
                  .where('u.archived=0')
                  .where('u.id=?', user.id);
          query.set('state_id', state, { dontQuote: true });
          queries.push(query);
          break;
        default:
          let attribute_id = squel
                             .select()
                             .field('id')
                             .from('user_attribute_keys')
                             .where('`key`=?',key);
          query = squel
                   .insert()
                   .into('user_attributes')
                   .setFields({
                     user_id: user.id,
                     attribute_id: attribute_id,
                     attribute: params[key]
                   })
                   .onDupUpdate('attribute', params[key]);

         queries.push(query);
         break;
      }
      user[key] = params[key];
    });

    return Promise.all(queries.map(function(query) {
      return db.query(query.toString()).then(function() {
        return user;
      });
    }));

  },
  logLastActivity: function(user) {
    if ( ! Game ) {
      Game = require('./game');
    }
    const promises = [];
    if ( user && user.id ) {
      let update_user = squel
                        .update()
                        .table('users')
                        .setFields({
                          last_activity: squel.fval('NOW(3)')
                        })
                       .where('id=?',user.id);

      promises.push(db.query(update_user));

      promises.push(Game.get({ user: user }).then(function(game) {
        if ( game && game.id ) {

          let update_game = squel
                            .update()
                            .table('games')
                            .setFields({
                              last_activity: squel.fval('NOW(3)')
                            })
                           .where('id=?',game.id);

          return db.query(update_game);
        }
      }));
    }

    return Promise.all(promises);
  }
};

module.exports = User;
