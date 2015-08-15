var passport = require('passport');

module.exports = function(app) {

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(message, user, err) {
            if ( err ) {
                // err is returned from passport's authentication
                // strategy before the callback is called. Usually
                // this indicates a credential is missing.
                res.json({ error: err.message });
            } else if ( message ) {
                res.json({ error: message });
            } else if ( ! user ) {
                res.json({ error: 'Unknown error' });
            } else {
                if (req.body.remember) {
                    req.session.cookie.maxAge = 1000 * 60 * 3;
                } else {
                    req.session.cookie.expires = false;
                }
                res.json({ username: user.username});
            }
        })(req, res, next);
    });

    app.post("/register", function(req, res, next) {
        passport.authenticate('local-register', function(message, user, err) {
            if ( err ) {
                // err is returned from passport's authentication
                // strategy before the callback is called. Usually
                // this indicates a credential is missing.
                res.json({ error: err.message });
            } else if ( message ) {
                res.json({ error: message });
            } else if ( ! user ) {
                res.json({ error: 'Unknown error' });
            } else {
                res.json({ username: req.body });
            }
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

