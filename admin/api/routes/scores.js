'use strict';
var squel = require('squel');
var db = require('../../db');
module.exports = function(app) {
  app.put('/api/games/:game_id/scores', function(req, res) {
    let game_id = req.params.game_id;
    let query = squel
                .update()
                .table('game_scores')
                .set('score', req.body.score)
                .where('game_id=?', game_id)
                .where('`key`=?', req.body.key);
    db.query(query).then(function(rows) {
      res.json(rows);
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
