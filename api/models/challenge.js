'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
import setKey from 'setKey';

const Challenge = {
  find: (params) => {
    let query = squel
    .select()
    .field('phrase')
    .from('challenges', 'c')
    .left_join('phrases', 'p', 'c.phrase_id=p.id');

    if (params.sender_id) {
      query = query
      .where('c.sender_id=?', params.sender_id)
      .where('c.protocol=?', params.protocol);
    }

    return db.query(query).then((phrase) => {
      return phrase;
    });
  }
};

module.exports = Challenge;
