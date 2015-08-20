var Q = require('q');
var squel = require('squel');

var db = require('db');
var Message = require('./message');
var Game = require('./game');
var Text;

var regex = require('../config/regex');

Q.longStackTraces = true;

var User = {
  // valid phone number test
  table: 'users',

  // create a new user number
  create: function(number, entry, platform) {
    var dfd = Q.defer();
    console.log('user create', number);

    if ( ! number ) {
      dfd.reject({
        errno: 4,
        message: 'You must provide a phone number'
      });
    } else {
      console.log('get single');
      this.get({ number: number }).then(function(user) {
        console.log('user?');
        if ( user ) {
          console.log('we have a user');
          if ( user.state === 'do-not-contact' ) {
            dfd.reject({
              errno: 3,
              message: 'Phone number is on the do not contact list'
            });
          } else {
            dfd.reject({
              errno: 2,
              message: 'Phone number is already registered'
            });
          }
        } else {
          user = { };

          var promises = [];

          if ( platform ) {
            promises.push(function() {
              var platform_id = squel
                               .select()
                               .field('id')
                               .from('platforms')
                               .where('platform=?', platform);

              return db.query(platform_id).then(function(platform_id) {
                if ( platform_id.length ) {
                  platform_id = platform_id[0].id;
                  query.set('platform_id', platform_id);
                } else {
                  throw "Platform does not exist " + platform;
                }
              });
            }());
          }

          if ( entry ) {
            promises.push(function() {
              var entry_id = squel
                             .select()
                             .field('id')
                             .from('user_entries')
                             .where('entry=?', entry);
              return db.query(entry_id).then(function(entry_id) {
                if ( entry_id.length ) {
                  entry_id = entry_id[0].id;
                  query.set('entry_id', entry_id);
                } else {
                  throw "Desired entry " + entry + " is not in the database";
                }
              });
            }());
          }

          //console.log('user', user);
          var query = squel
                      .insert()
                      .into('users')
                      .setFields(user);
                      console.log(query.toString());

          var state = 'waiting-for-confirmation';
          promises.push(function() {
            var user_state = squel
                             .select()
                             .field('id')
                             .from('user_states')
                             .where('state=?',state);
            return db.query(user_state).then(function(state_id) {
              if ( state_id.length ) {
                state_id = state_id[0].id;
                query.set('state_id', state_id);
              }
            });
          }());

          Q.allSettled(promises).spread(function() {
            console.log('all done with promises', query.toString());
            db.query(query).then(function(rows) {
              var user_id = rows.insertId;
              var key_id = squel
                           .select()
                           .field('id')
                           .from('user_attribute_keys')
                           .where('`key`=?','number');

              var attribute_query = squel
                                    .insert()
                                    .into('user_attributes')
                                    .setFields({
                                      user_id: user_id,
                                      key_id: key_id,
                                      value: number 
                                    });
              return db.query(attribute_query.toString()).then(function() {
                return user_id;
              }).catch(function(e) {
                console.error(e);
                return e;
              });
            }).then(function(user_id) {
              this.get({
                id: user_id
              }).then(function(user) {
                dfd.resolve(user);
              });

            }.bind(this)).fail(function(err) {
              console.log('failed in the db create, means there was a db error', err);
              console.log(query.toString());
              switch(err.errno) {
                // at this point, they could be blacklisted
                case 1062:
                  console.error('This is fucked; we should have caught this when we did our initial user check above.');
                  dfd.reject({
                    errno: 2,
                    message: 'Phone number is already registered'
                  });
                break;
                default: 
                  console.error('error registering phone number', err);
                  dfd.reject({
                    errno: 5,
                    message: 'There was an unknown error registering the phone number. Please try again later'
                  });
                break;
              }
            });
          }.bind(this)).fail(function(err) {
            console.error('failed in the all settled', err);
          });
        }
      }.bind(this));

    }
    return dfd.promise;
  },
  get: function(user) {
    var dfd = Q.defer();
    console.log('ready to get user');
    function fetchUser(key, val) {
      console.log('fetch user!');
      var query = squel
                  .select()
                  .field('u.id')
                  .field('u.username')
                  .field('u.created')
                  .field('i.inviter_id')
                  .field('p.platform', 'platform')
                  .field('s.state', 'state')
                  .from('users', 'u')
                  .left_join('invites', 'i', 'u.id = i.invited_id')
                  .left_join('platforms', 'p', 'p.id = u.platform_id')
                  .left_join('user_states', 's', 's.id = u.state_id')
                  .where('u.`'+key+'`=?', val);

      return db.query(query.toString()).then(function(users) {
        var user;
        console.log('here', users);
        if ( users && users.length ) {
          console.log('user exists');
          user = users[0];
        } else {
          console.log('user does not exists');
          return null;
        }

        var query = squel
                    .select()
                    .field('a.value')
                    .field('k.`key`')
                    .from('user_attributes', 'a')
                    .left_join('users', 'u', 'u.id = a.user_id')
                    .left_join('user_attribute_keys', 'k', 'k.id = a.key_id')
                    .where('u.`'+key+'`=?', val)
                    .where('a.user_id=?',user.id);
        return db.query(query).then(function(attributes) {
          console.log('the user at first', user);
          console.log('the attributes', attributes);
          attributes.map(function(attribute) {
            user[attribute.key] = attribute.value;
          });
          console.log('the user afterwards', user);
          return user;
        });
      });
    }

    if ( typeof user === 'object' ) {
      // then we've passed a user object
      if ( user.id ) {
        return fetchUser('id', user.id);
      } else if ( user.number ) {
        return fetchUser('number', user.number);
      } else if ( user.username ) {
        return fetchUser('username', user.username);
      } else {
        dfd.reject(new Error({
          message: 'Tried to select on an invalid user key'
        }));
      }
    } else {
      // we've passed a number
      return fetchUser('number', user);
    }
    return dfd.promise;
  },
  update: function(user, params) {
    var dfd = Q.defer();
    console.log('user model update');
    this.get(user).then(function(user) {
      console.log('got user');
      if ( user ) {
        return Q.resolve(user);
      } else {
        return Q.reject('no user found for user id ' + user_id);
      }
    }).then(function(user) {
      console.log('user is resolved');
      // a whitelisted array of arguments we're allowed to update
      var whitelist = [
        'username',
        'state'
      ];

      var query = squel
                  .update()
                  .table('users')
                  .where('id=?', user.id);

                  console.log('params', params);
      Object.keys(params).filter(function(key) {
        if ( whitelist.indexOf(key) !== -1 ) {
          return true;
        }
      }).map(function(key) {
        switch(key) {
          case 'state' :
            var state = squel
                         .select()
                         .field('id')
                         .from('user_states')
                         .where('state=?',params[key]);

            query.set('state_id', state, { dontQuote: true });
            break;
          default:
            query.set(key, params[key]);
            break;
        }
        user[key] = params[key];
      });

      return db.query(query).then(function(rows) {
        // if a user has specified they are ready to play,
        // let the game know
        if ( params.state === 'ready-for-game' ) {
          Game.notify(user);
        }
        dfd.resolve(user);
      });
    }).fail(function(err) {
      console.error('db error', err);
      dfd.reject(err);
    });
    return dfd.promise;
  },
  // set a user's status to onboarded being true
  updateState: function(state, number) {
    var user_state = squel
                     .select()
                     .field('id')
                     .from('user_states')
                     .where('state=?',state);

    var query = squel
                .update()
                .table('users')
                .set('state_id', user_state, { dontQuote: true })
                .where('number=?', number);

    return db.query(query);
  },
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
        console.log('its twilio', user, message_key);
        if ( ! Text || ! Text.send ) {
          Text = require('./text');
        }
        return Text.send(user.number, message_key, options).fail(function(err) {
          if ( err && err.code ) {
            switch(err.code) {
              case 21608:
                // this is an unverified number
                throw {
                  errno: 6,
                  message: 'this is an unverified number'
                }
                break;
              default:
                console.error('error when sending message', err);
                throw err;
                break;
            }
          } else {
            console.error('error when sending message', err);
            throw {
              message: err
            };
          }
        });
        break;
      default:
        return Q.reject('No platform specified');
        break;
    }
  }
};

module.exports = User;