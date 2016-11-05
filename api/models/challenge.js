'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
import setKey from 'setKey';

const Challenge = {
  guesses: (params) => {
    let query = squel
    .select()
    .from('challenge_guesses', 'c');

    if (params.sender_id) {
      query = query.where('c.sender_id=?', params.sender_id);
    }

    if (params.protocol) {
      query = query.where('c.protocol=?', params.protocol);
    }

    if (params.from) {
      query = query.where('c.from=?', params.from);
    }

    if (params.user_id) {
      query = query.where('c.user_id=?', params.user_id);
    }

    return db.query(query).then(guesses => {
      return guesses.reduce((obj, guess) => {
        return {
          ...obj,
          [guess.sender_id]: (obj[guess.sender_id] || []).concat(guess),
        };
      }, {});
    });
  },
  guess: (params) => {
    const query = squel
    .insert({
      autoQuoteFieldNames: true,
    })
    .into('challenge_guesses')
    .setFields({
      phrase_id: params.phrase_id,
      sender_id: params.sender_id,
      from: params.from,
      protocol: params.protocol,
      guess: params.guess,
      user_id: params.user_id,
      correct: params.correct,
      created: squel.fval('NOW(3)'),
    });

    return db.query(query);
  },
  find: (params) => {
    let query = squel
    .select()
    .field('phrase')
    .field('clue')
    .field('prompt')
    .from('challenges', 'c')
    .left_join('phrases', 'p', 'c.phrase_id=p.id')
    .left_join('clues', 'l', 'l.phrase_id=p.id');

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
