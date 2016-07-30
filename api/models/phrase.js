'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
import setKey from 'setKey';

const Phrase = {
  create: (params) => {
    const query = squel
                  .insert()
                  .into('phrases')
                  .setFields({
                    phrase: params.phrase.toUpperCase(),
                    category_id: params.category_id
                  });
    return db.query(query).then(result => {
      if (result.insertId) {
        return setKey('phrases', {
          ...params,
          id: result.insertId,
        }).then(() => {
          const phrase_id = result.insertId;
          const insert_clue = squel
          .insert()
          .into('clues')
          .setFields({
            clue: params.clue.toUpperCase(),
            phrase_id
          });
          return db.query(insert_clue).then((clueResult) => {
            return setKey('clues', {
              clue: params.clue,
              phrase_id,
              id: clueResult.insertId,
            }).then(() => {
              return Phrase.find({ id: phrase_id}).then((phrases) => {
                return phrases.pop();
              });
            });
          });
        });
      } else {
        return {
          error: 'Could not add to database'
        };
      }
    });
  },
  find: (params) => {
    let query = squel
                .select()
                .field('phrase')
                .field('p.created')
                .field('p.id')
                .field('nickname', 'admin')
                .field('category')
                .field('category_id')
                .field('clue')
                .from('phrases', 'p')
                .left_join('categories', 'c', 'c.id=p.category_id')
                .left_join('clues', 'e', 'e.phrase_id=p.id')
                .left_join('users', 'u', 'u.id=p.admin_id')
                .order('p.id', false);

    if (params.id) {
      query = query.where('p.id=?', params.id);
    }

    return db.query(query).then((phrase) => {
      return phrase;
    });
  }
};

module.exports = Phrase;

