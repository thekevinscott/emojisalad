'use strict';
var squel = require('squel');
var db = require('db');
module.exports = function(app) {
  app.get('/api/games', function(req, res) {
    var query = squel
                .select()
                .from('games');
    db.query(query).then(function(rows) {
      res.json(rows);
    }).catch(function(err) {
      res.json({error: err});
    });
  });

  app.get('/api/games/:game_id', function(req, res) {
    var rounds = squel
                 .select()
                 .field('game_id')
                 .field('COUNT(1) as round_count')
                 .from('rounds')
                 .group('game_id');

    var query = squel
        .select()
        .field('g.created')
        .field('s.state')
        .field('r.round_count as rounds')
        .field('u.id as user_id')
        .from('games', 'g')
        .left_join('game_participants', 'p', 'p.game_id=g.id')
        .left_join('game_states', 's', 's.id=g.state_id')
        .left_join('users', 'u', 'u.id=p.user_id')
        .left_join(rounds, 'r', 'r.game_id=g.id')
        .where('g.id=?',req.params.game_id);
    db.query(query.toString()).then(function(rows) {
      if ( rows.length ) {
        let game = {
          id: req.params.game_id,
          state: rows[0].state,
          created: new Date(rows[0].created),
          rounds: rows[0].rounds,
          players: rows.map(function(row) {
            return {
              id: row.user_id
            };
          })
        };
        let getScores = squel
                        .select()
                        .from('game_scores')
                        .where('game_id=?',game.id);
                        console.log(getScores.toString());
        db.query(getScores.toString()).then(function(rows) {
          let scores = {};
          rows.map(function(row) {
            scores[row.key] = {
              score: row.score,
              updated: row.updated,
              created: row.created
            };
          });
          game.scores = scores;
          res.json(game);
        });
      } else {
        res.json({});
      }
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
