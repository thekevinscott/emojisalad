'use strict';
const Phrase = require('models/phrase');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find
  },
  {
    path: '/',
    method: 'post',
    fn: create
  }
];

function create(req) {
  return Phrase.create(req.body);
}

function find(req) {
  return Phrase.find(req.query);
}
