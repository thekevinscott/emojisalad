var crypt = require('crypt3');
var passport = require('passport');
var Q = require('q');

var LocalStrategy = require('passport-local').Strategy;

var squel = require('squel');

var db = require('./db');

var table = 'admins';

module.exports = function(app, conn) {
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
        // you can do this however you want with whatever variables you set up
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

        var user = {
            username: username,
            password: password,
            salt: crypt.createSalt('sha512')
        };

        user.password = crypt(password, user.salt);

        db.query(query).then(function(rows) {
            if (rows && rows.length) {
                var msg = 'That username is already taken.';
                done(msg);
                throw msg;
            } else {
                // if there is no user with that username
                // create the user
                var query = squel
                            .insert()
                            .into(table)
                            .setFields(user);

                            //var dfd = Q.defer();
                            //dfd.resolve({insertId: 'foo' });
                            //return dfd.promise;
                return db.query(query);
            }	
        }).then(function(data) {
            user.id = data.insertId;
            return done(null, {
                username: user.username,
                id: user.id 
            });
        }).fail(function(err) {
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
            } else if ( crypt(password, rows[0].salt) !== rows[0].password ) {
                return done(error_message);
            } else {
                // all is well, return successful user
                return done(null, rows[0]);			
            }
        }, function(err) {
            return done('There was an unknown error; please try again later.');
        });
    }));

    return isAuthenticated;
};
