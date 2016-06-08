'use strict';
const squel = require('squel');
const db = require('db');
module.exports = function(app) {
  app.get('/api/games', function(req, res) {
    const query = squel
                .select()
                .from('games');
    db.query(query).then(function(rows) {
      res.json(rows);
    }).catch(function(err) {
      res.json({error: err});
    });
  });

  app.get('/api/games/:game_id', function(req, res) {
    const rounds = squel
                 .select()
                 .field('game_id')
                 .field('COUNT(1) as round_count')
                 .from('rounds')
                 .group('game_id');

    const query = squel
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
        const game = {
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
        res.json(game);
      } else {
        res.json({});
      }
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
