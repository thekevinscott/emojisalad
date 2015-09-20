'use strict';
var bcrypt = require('bcrypt');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var squel = require('squel');

var db = require('../db');

var table = 'admins';

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {

    var query = squel
                .select()
                .from(table)
                .where('id=?', id);

    db.query(query).then(function(rows) {
      return done(null, rows[0]);
    }, function(err) {
      return done(err);
    });
  });


  function isAuthenticated(req, res, next) {
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    if (req.user) {
      return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
  }

  passport.use('local-register', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with username
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    if ( username.length < 1 ) {
      return done('Your username must be longer than 1 character');
    }
    if ( password.length < 5 ) {
      return done('Your password must be longer than 5 characters');
    }


    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    //
    var query = squel
                .select()
                .from(table)
                .where('username=?', username);

                
    let user = {
      username: username,
      password: password,
      salt: bcrypt.genSaltSync(10)
    };

    user.password = bcrypt.hashSync(password, user.salt);

    db.query(query.toString()).then(function(rows) {
      if (rows && rows.length) {
        console.log('rows', rows);
        let msg = 'That username is already taken.';
        return done(msg);
      } else {
        var query = squel
                    .insert()
                    .into(table)
                    .setFields(user);
        return db.query(query).then(function(data) {
          user.id = data.insertId;
          return done(null, {
            username: user.username,
            id: user.id 
          });
        });
      }	
    }).catch(function(err) {
      console.error('err', err);
      return done('There was an unknown error; please try again later.');
    });
  }));


  // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with username
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    var query = squel
                .select()
                .from(table)
                .where('username=?', username);

    var error_message = 'There was an error logging in. Please try again.';

    db.query(query).then(function(rows) {
      if (!rows.length) {
        return done(error_message);
      } else if ( bcrypt.hashSync(password, rows[0].salt) !== rows[0].password ) {
        return done(error_message);
      } else {
        // all is well, return successful user
        return done(null, rows[0]);			
      }
    }, function(err) {
      console.error(err);
      return done('There was an unknown error; please try again later.');
    });
  }));

  return isAuthenticated;
};
