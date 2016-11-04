'use strict';
//const Promise = require('bluebird');
const Phrase = require('models/phrase');
const User = require('models/user');

module.exports = ({
  message,
  phrase,
  user,
}) => {
  return [{
    player: user,
    key: 'challenge_help',
    protocol: user.protocol,
    options: {
      phrase,
    },
  }];
};

