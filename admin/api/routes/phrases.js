'use strict';
const squel = require('squel');
const db = require('db');
module.exports = function(app) {
  app.delete('/api/phrases/:phrase_id', function(req, res) {
    let query = squel
                .delete()
                .from('phrases')
                .where('id=?',req.params.phrase_id);

    db.query(query).then(function(result) {
      let clue_query = squel
                       .delete()
                       .from('clues')
                       .where('phrase_id=?',req.params.phrase_id);
      return db.query(clue_query).then(function() {
        res.json(result);
      });
    }).catch(function(err) {
      res.json({ error: err });
    });
  });

  app.put('/api/phrases/:phrase_id', function(req, res) {
    let query = squel
                .update()
                .table('phrases')
                .where('id=?',req.params.phrase_id);

    if ( req.body.phrase ) {
      query.setFields({ phrase : req.body.phrase });
    }

    if ( req.body.admin_id ) {
      query.setFields({ admin_id : req.body.admin_id });
    }

    if ( req.body.category_id ) {
      query.setFields({ category_id : req.body.category_id });
    } else if ( req.body.category ) {
      let category_id = squel
                        .select()
                        .field('id')
                        .from('categories')
                        .where('category=?',req.body.category);
      query.setFields({ category_id : category_id });
    }
    db.query(query).then(function(rows) {
      res.json(rows);
    }).catch(function(err) {
      res.json({ error: err });
    });
  });

  app.delete('/api/phrases/:phrase_id/clues/:clue_id', function(req, res) {
    let query = squel
                .select()
                .field('id')
                .from('phrases')
                .where('id=?',req.params.phrase_id);
    db.query(query).then(function(rows) {
      if ( ! rows.length ) {
        throw "No phrase found for that ID";
      } else {
        let clue_query = squel
                         .delete()
                         .from('clues')
                         .where('id=?',req.params.clue_id);
        return db.query(clue_query).then(function(rows) {
          res.json(rows);
        });
      }
    }).catch(function(err) {
      res.json({ error: err });
    });
  });
  app.put('/api/phrases/:phrase_id/clues/:clue_id', function(req, res) {
    let query = squel
                .select()
                .field('id')
                .from('phrases')
                .where('id=?',req.params.phrase_id);
    db.query(query).then(function(rows) {
      if ( ! rows.length ) {
        throw "No phrase found for that ID";
      } else {
        let phrase_id = rows[0].id;
        let clue_query = squel
                         .update()
                         .table('clues')
                         .setFields({
                           clue: req.body.clue
                         })
                         .where('phrase_id=?',phrase_id);
        return db.query(clue_query).then(function(rows) {
          res.json(rows);
        });
      }
    }).catch(function(err) {
      res.json({ error: err });
    });
  });
  app.post('/api/phrases/:phrase_id/clue', function(req, res) {
    let query = squel
                .select()
                .field('id')
                .from('phrases')
                .where('id=?',req.params.phrase_id);
    db.query(query).then(function(rows) {
      if ( ! rows.length ) {
        throw "No phrase found for that ID";
      } else {
        let phrase_id = rows[0].id;
        let clue_query = squel
                         .insert()
                         .into('clues')
                         .setFields({
                           phrase_id: phrase_id,
                           clue: req.body.clue
                         });
        return db.query(clue_query).then(function(rows) {
          res.json(rows);
        });
      }
    }).catch(function(err) {
      res.json({ error: err });
    });
  });
  app.post('/api/phrases', function(req, res) {
    let query = squel
                .insert()
                .into('phrases')
                .setFields({
                  phrase: req.body.phrase,
                  admin_id: req.body.admin_id,
                });

    if ( req.body.category_id ) {
      query.setFields({ category_id : req.body.category_id });
    } else if ( req.body.category ) {
      let category_id = squel
                        .select()
                        .field('id')
                        .from('categories')
                        .where('category=?',req.body.category);
      query.setFields({ category_id : category_id });
    }

    db.query(query.toString()).then(function(rows) {
      return res.json(rows);
    });
  });

  app.get('/api/categories', function(req, res) {
    let query = squel
                .select()
                .from('categories');
    db.query(query).then(function(rows) {
      return res.json(rows);
    });
  });
  app.get('/api/phrases', function(req, res) {
    let query = squel
                .select()
                .field('a.username', 'admin')
                .field('p.phrase')
                .field('p.id')
                .field('p.created')
                .field('c.category')
                .field('c.id','category_id')
                .left_join('admins','a','a.id=p.admin_id')
                .left_join('categories','c','c.id=p.category_id')
                .from('phrases','p');
    db.query(query).then(function(rows) {
      let phrases = {};
      let phrase_ids = rows.map(function(phrase) {
        phrases[phrase.id] = phrase;
        return phrase.id;
      });
      let clue_query = squel
                       .select()
                       .from('clues','c')
                       .where('c.phrase_id IN ?', phrase_ids);

      return db.query(clue_query).then(function(clues) {
        clues.map(function(clue) {
          if ( !phrases[clue.phrase_id].clues ) {
            phrases[clue.phrase_id].clues = [];
          }
          phrases[clue.phrase_id].clues.push(clue);
        });
        res.json(Object.keys(phrases).map(function(key) {
          return phrases[key];
        }));
      });
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
