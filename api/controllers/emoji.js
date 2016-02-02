'use strict';
const Emoji = require('models/emoji');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
  {
    path: '/check',
    method: 'post',
    fn: check 
  },
  {
    path: '/check/:emoji',
    method: 'post',
    fn: check 
  },
];

function find() {
  return Emoji.getRandom();
}
function check(req) {
  const emoji = req.body.emoji || '';
  return Emoji.check(emoji);
}
