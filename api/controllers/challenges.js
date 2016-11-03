'use strict';
const Challenge = require('models/challenge');

function find(req) {
  return Challenge.find(req.query);
}

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find,
  }
];
