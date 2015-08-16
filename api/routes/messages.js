var squel = require('squel');
var db = require('db');
module.exports = function(app) {
  app.put('/api/messages', function(req, res) {
    var message = req.body.message;
    var message_id = req.body.message_id;
    var query = squel
        .update()
        .table('messages')
        .set('message', message)
        .where('id=?', message_id);
    db.query(query).then(function(rows) {
      res.json({});
    }).fail(function(err) {
      res.json({error: err});
    });
  });

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
