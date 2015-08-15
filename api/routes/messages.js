var squel = require('squel');
var db = require('../db');
module.exports = function(app) {
  app.get('/api/messages', function(req, res) {
    var query = squel
        .select()
        .from('messages');
    db.query(query).then(function(rows) {
      res.json(rows);
    }).fail(function(err) {
      res.json({error: err});
    });
  });
}
