'use strict';
const squel = require('squel');
const db = require('db');
module.exports = function(app) {
  app.delete('/api/messages/:message_id', function(req, res) {
    var query = squel
        .delete()
        .from('messages')
        .where('id=?',req.params.message_id);
    db.query(query).then(function() {
      res.json({});
    }).catch(function(err) {
      res.json({error: err});
    });
  });

  app.post('/api/messages', function(req, res) {
    var key = req.body.key;
    var message = req.body.message;
    var name = req.body.name;
    var query = squel
        .insert({ autoEscapeFieldNames: true })
        .into('messages')
        .set('message', message)
        .set('name', name)
        .set('key', key);

    db.query(query).then(function() {
      var query = squel
          .select()
          .from('messages');
      return db.query(query).then(function(rows) {
        res.json(rows);
      });
    }).catch(function(err) {
      res.json({error: err});
    });
  });

  app.put('/api/messages', function(req, res) {
    var message = req.body.message;
    var message_id = req.body.message_id;
    var query = squel
        .update()
        .table('messages')
        .set('message', message)
        .where('id=?', message_id);
    db.query(query).then(function() {
      res.json({});
    }).catch(function(err) {
      res.json({error: err});
    });
  });

  app.get('/api/messages', function(req, res) {
    var query = squel
        .select()
        .from('messages');
    db.query(query).then(function(rows) {
      res.json(rows);
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
