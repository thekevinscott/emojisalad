'use strict';
//const Promise = require('bluebird');
const Phrase = require('models/phrase');
const User = require('models/user');

module.exports = ({
  user,
  message,
  phrase,
}) => {

  return [{
    player: user,
    key: 'challenge_clue',
    protocol: user.protocol,
    options: {
      phrase,
    },
  }];
};
