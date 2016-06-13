'use strict';
const squel = require('squel');
const db = require('db');
module.exports = (app, io) => {
  app.get('/api/games/:game_id/score', (req, res) => {
    const query = squel
    .select()
    .field('u.nickname')
    .from('rounds', 'r')
    .left_join('players', 'p', 'p.id=r.winner_id')
    .left_join('users', 'u', 'u.id=p.user_id')
    .where('r.game_id = ?', req.params.game_id)
    .where('winner_id IS NOT NULL');

    const count_query = squel
    .select()
    .field('nickname', 'player')
    .field('count(1) as wins')
    .from(query, 't')
    .group('nickname')
    .order('count(1)', false);

    console.log(count_query.toString());
    return db.query(count_query.toString()).then(result => {
      res.json(result);
    }).catch(res.json);
  });
};
