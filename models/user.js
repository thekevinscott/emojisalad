var Q = require('q');
var squel = require('squel');

var db = require('db');
var Message = require('./message');
var Text;

var regex = require('../config/regex');

var User = {
  // valid phone number test
  formatNumber: function(s) {
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : '+1'+m[1]+m[2]+m[3];
  },
  table: 'users',

  // create a new user number
  create: function(number, state, inviter_number) {
    var dfd = Q.defer();

    if ( ! number ) {
      dfd.reject('You must provide a phone number');
    //} else if ( !regex('phone').test(number) ) {
      //console.log('number', number, 'failed regex');
      //dfd.reject('You must provide a valid phone number');
    } else {
      var user = {
        number: this.formatNumber(number),
        origNumber: this.formatNumber(number)
      };

      var promises = [];

      if ( inviter_number ) {
        promises.push(function() {
          console.log('the inviter promise');
          var inviter_id = squel
                           .select()
                           .field('id')
                           .from('users')
                           .where('number=?', inviter_number);

          return db.query(inviter_id).then(function(inviter_id) {
            if ( inviter_id.length ) {
              inviter_id = inviter_id[0].id;
              query.set('inviter_id', inviter_id);
            } else {
              throw "This should never happen - the user who invited this phone is not in databse" + inviter_id;
            }
          });
        }());
      }

      var query = squel
                  .insert()
                  .into(this.table)
                  .setFields(user);

      if ( state ) {
        promises.push(function() {
          console.log('the state promise');
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
      }

      Q.allSettled(promises).spread(function() {
        db.query(query).then(function(rows) {
          dfd.resolve({
            id: rows.insertId,
            number: user.number
          });
        }).fail(function(err) {
          switch(err.errno) {
            case 1062:
              dfd.reject('Phone number is already registered');
            break;
            default: 
              console.error('error registering phone number', err);
            dfd.reject('There was an unknown error registering the phone number. Please try again later');
            break;
          }
        });
      });
    }
    return dfd.promise;
  },
  lastStep: function(number, skip) {
    var query = squel
                .select()
                .field('m.key')
                .from('texts', 't')
                .left_join('messages', 'm', 't.message_id = m.id')
                .left_join('users', 'u', 'u.id = t.user_id')
                .where('u.number = ?', number)
                .order('t.created', false)

    return db.query(query).then(function(steps) {
      if ( steps.length ) {
        if ( ! skip || ! skip.length ) {
          return steps[0].key;
        } else {
          for ( var i=0;i<steps.length;i++ ) {
            if ( skip.indexOf(steps[i].key) === -1 ) {
              return steps[i].key;
            }
          }
          return 'No last step found that was excluded by skip';
        }
      } else {
        return null;
      }
    });
  },
  updatePhone: function(number, user) {
    if ( number !== user.number ) {
      var query = squel
                  .update()
                  .table('users')
                  .set('number', number)
                  .where('id=?',user.id);

      return db.query(query);
    }
  },
  updateNickname: function(nickname, number) {
    var query = squel
                .update()
                .table('users')
                .set('nickname', nickname)
                .where('number=?', number);

    return db.query(query);
  },
  get: function(user) {
    var dfd = Q.defer();
    function fetchUser(key, val) {
      var query = squel
                  .select()
                  .field('u.id')
                  .field('u.number')
                  .field('u.nickname')
                  .field('u.created')
                  .field('u.inviter_id')
                  .field('i.number', 'inviter_number')
                  .from('users', 'u')
                  .left_join('users', 'i', 'i.id = u.inviter_id')
                  .where('u.`'+key+'`=?', val);
                  console.log(query.toString());
      db.query(query.toString()).then(dfd.resolve).fail(dfd.reject);
    }
    if ( typeof user === 'object' ) {
      // then we've passed a user object
      if ( user.id ) {
        fetchUser('id', user.id);
      } else {
        fetchUser('number', user.number);
      }
    } else {
      // we've passed a number
      fetchUser('number', user);
    }
    return dfd.promise;
  },
  // return the new user created
  invite: function(msg, invitingUserNumber) {
    if ( ! Text || ! Text.send ) {
      Text = require('./text');
    }
    var invitedNumber = msg.split('invite ').pop();
    return Q.allSettled([
      User.create(invitedNumber, 'invited', invitingUserNumber),
      User.get(invitingUserNumber)
    ]).spread(function(invitedUserPromise, invitingUserPromise) {
      /* 
       * invitedUser { state: 'fulfilled', value: { id: 116, number: '4126382398' } }
       * invitingUser { state: 'fulfilled',
       *   value:
       *      [ { id: 109,
       *             number: '+18604608183',
       *                    nickname: 'Kevin',
       *                           created: Sun Aug 16 2015 11:30:00 GMT-0400 (EDT) } ] }
       *                           */
      if ( invitedUserPromise.state === 'rejected' ) {
        switch(invitedUserPromise.reason) {
          case 'Phone number is already registered' :
            throw {
              key: 'already_invited',
              data: [invitedNumber]
            };
            break;
          default:
            throw invitedUserPromise.reason
            break;
        }
      } else {
        var invitedUser = invitedUserPromise.value;
        var invitingUser = invitingUserPromise.value[0];
        return Text.send(invitedUser, 'invite', [ invitingUser.nickname ]).fail(function(err) {
          console.log('err back from twilio, process this', err);
          throw err.message;
        }).then(function(response) {
          return {
            invitedUser: invitedUser,
            invitingUser: invitingUser
          };
        });
      }
    });
  },
  // set a user's status to onboarded being true
  updateState: function(state, number) {
    console.log('update user state');
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
                console.log('state query', query.toString());

    return db.query(query);
  },
  // check to see if a user has completed onboarding
  onboarded: function(number) {
    var query = squel
                .select()
                .field('s.state')
                .from('users', 'u')
                .left_join('user_states', 's', 's.id = u.state_id')
                .where('u.number=?', number);

    return db.query(query.toString()).then(function(state) {
      console.log('the user state', number, state);
      if ( state !== 'created' && state !== 'invited' ) {
        return true;
      } else {
        return false;
      }
    });
    /*
    var weDontCareAboutTheseSteps = [
      'intro_error',
      'not_yet_onboarded_error'
    ];
    return this.lastStep(number, weDontCareAboutTheseSteps).then(function(message_key) {
      var onboardingSteps = [
        'intro',
        'intro_2'
      ];
      if ( onboardingSteps.indexOf(message_key) === -1 ) {
        return {
          onboarded: true
        };
      } else {
        return {
          onboarded: false ,
          last_step: message_key
        };
      }
    });
    */
  }
};

module.exports = User;
