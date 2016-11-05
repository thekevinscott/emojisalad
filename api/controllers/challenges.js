'use strict';
const Challenge = require('models/challenge');

function find(req) {
  return Challenge.find(req.query);
}

function guess(req) {
  return Challenge.guess(req.body);
}

function guesses(req) {
  return Challenge.guesses(req.body);
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
    fn: guess,
  },
  {
    path: '/guesses',
    method: 'get',
    fn: guesses,
  },
];
