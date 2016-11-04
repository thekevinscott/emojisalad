'use strict';
const Phrase = require('models/phrase');

function create(req) {
  return Phrase.create(req.body);
}

function find(req) {
  return Phrase.find(req.query);
}

function guess(req) {
  return Phrase.guess(req.body.guess, req.body.phrase).then(result => {
    return {
      result,
    };
  });
}

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find,
  },
  {
    path: '/',
    method: 'post',
    fn: create,
  },
  {
    path: '/guess',
    method: 'post',
    fn: guess,
  }
];
