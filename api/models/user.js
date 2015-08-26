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
  create: function(user, entry, platform) {
    var dfd = Q.defer();
    //console.log('user create', user);
    var attributes = {};
    if ( user.number ) {
      attributes.number = user.number;
    } else if ( user['messenger-name'] ) {
      attributes['messenger-name'] = user['messenger-name'];
    }

    if ( ! user ) {
      dfd.reject({
        errno: 7,
        message: 'You must provide a valid user'
      });
    } else if ( ! user.number && ! user['messenger-name'] ) {
      dfd.reject({
        errno: 4,
        message: 'You must provide a user with valid contact info'
      });
    } else {
      //console.log('get single');
      this.get(user).then(function(user) {
        //console.log('user?', user);
        if ( user ) {
          //console.log('we have a user');
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
                      //console.log(query.toString());

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
            //console.log('all done with promises', query.toString());
            db.query(query).then(function(rows) {
              var user_id = rows.insertId;

              function getAttributeQuery(key) {
                var attribute_id = squel
                                   .select()
                                   .field('id')
                                   .from('user_attribute_keys')
                                   .where('`key`=?',key);

                return squel
                        .insert()
                        .into('user_attributes')
                        .setFields({
                          user_id: user_id,
                          attribute_id: attribute_id,
                          attribute: attributes[key] 
                        });
              }

              if ( attributes.number ) {
                var attribute_query = getAttributeQuery('number');
              } else if ( attributes['messenger-name'] ) {
                var attribute_query = getAttributeQuery('messenger-name');
              }

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
                //console.log('got user in create', user);
                dfd.resolve(user);
              });

            }.bind(this)).fail(function(err) {
              console.log('failed in the db create, means there was a db error', err);
              //console.log(query.toString());
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
    //console.log('ready to get user');
    function fetchUser(key, val) {
      //console.log('fetch user!', key, val);
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
                  .left_join('user_attributes', 'a', 'a.user_id = u.id')
                  .left_join('user_attribute_keys', 'k', 'a.attribute_id = k.id');
      if ( key === 'id' || key === 'username' ) {
        query = query.where('u.`'+key+'`=?', val);
      } else {
        query = query
                .where('k.`key`=?', key)
                .where('a.attribute=?', val);
      }


      //console.log("get query", query.toString());
      return db.query(query.toString()).then(function(users) {
        var user;
        //console.log('here', users);
        if ( users && users.length ) {
          //console.log('user exists');
          user = users[0];
        } else {
          //console.log('user does not exists');
          return null;
        }

        var query = squel
                    .select()
                    .field('a.attribute')
                    .field('k.`key`')
                    .from('user_attributes', 'a')
                    .left_join('users', 'u', 'u.id = a.user_id')
                    .left_join('user_attribute_keys', 'k', 'k.id = a.attribute_id')
                    //.where('k.`key`=?', key)
                    //.where('a.attribute=?', val)
                    .where('a.user_id=?',user.id);

        return db.query(query).then(function(attributes) {
          //console.log('got the attributes', attributes);
          attributes.map(function(attribute) {
            user[attribute.key] = attribute.attribute;
          });
          //console.log('the user afterwards', user);
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
      } else if ( user['messenger-name'] ) {
        return fetchUser('messenger-name', user['messenger-name']);
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
    //console.log('user model update');
    this.get(user).then(function(user) {
      //console.log('got user');
      if ( user ) {
        return Q.resolve(user);
      } else {
        return Q.reject('no user found for user id ' + user_id);
      }
    }).then(function(user) {
      //console.log('user is resolved');
      // a whitelisted array of arguments we're allowed to update
      var whitelist = [
        'username',
        'state'
      ];

      var query = squel
                  .update()
                  .table('users')
                  .where('id=?', user.id);

                  //console.log('params', params);
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
