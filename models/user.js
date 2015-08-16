var Q = require('q');
var squel = require('squel');

var db = require('db');
var Message = require('./message');

var User = {
  // valid phone number test
  regex : /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
  formatNumber: function(s) {
    return s;
    //var s2 = (""+s).replace(/\D/g, '');
    //var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    //return (!m) ? null : '+1'+m[1]+m[2]+m[3];
  },
  table: 'users',

  // create a new user number
  create: function(number) {
    var dfd = Q.defer();

    if ( ! number ) {
      dfd.reject('You must provide a phone number');
    } else if ( !this.regex.test(number) ) {
      dfd.reject('You must provide a valid phone number');
    } else {
      var user = {
        number: this.formatNumber(number)
      };
      var query = squel
                  .insert()
                  .into(this.table)
                  .setFields(user);

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
    }
    return dfd.promise;
  },
  lastStep: function(number) {
    var query = squel
                .select()
                .field('m.key')
                .from('messages', 'm')
                .left_join("texts", 't', "t.message_id = m.id")
                .left_join("users", 'u', "u.id = t.user_id")
                .where('u.number = ?', number)
                .order('t.created', false)
                .limit('1');

    return db.query(query).then(function(steps) {
      if ( steps.length ) {
        return steps[0].key;
        //return Message.get(steps[0].key);
      } else {
        throw "No last step found";
      }
    });
  },
  updatePhone: function(number, id) {
    var query = squel
                .update()
                .table('users')
                .set('number', number)
                .where('id=?',id);

    return db.query(query);
  },
  updateNickname: function(nickname, number) {
    console.log('update nickname', nickname, number);
    var query = squel
                .update()
                .table('users')
                .set('nickname', nickname)
                .where('number=?', number);
                console.log(query.toString());

    return db.query(query);
  }
};

module.exports = User;
