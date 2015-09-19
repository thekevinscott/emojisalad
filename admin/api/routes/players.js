var squel = require('squel');
var db = require('../../db');
module.exports = function(app) {
  app.get('/api/players', function(req, res) {
    var query = squel
        .select()
        .from('users');
    db.query(query).then(function(rows) {
      res.json(rows);
    }).fail(function(err) {
      res.json({error: err});
    });
  });
}
