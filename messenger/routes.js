var getUser = require('./getUser');
module.exports = function(app) {
  app.get('/api/user/:user_id', function(req, res) {
    getUser(req.params.user_id).then(function(user) {
      if ( user ) {
        res.json(user);
      } else {
        res.json({});
      }
    }).catch(function(err) {
      console.error('some err', err);
      res.json({});
    });
  });

  app.get('*', function(req, res) {
    res.render('index');
  });
};
