'use strict';
const signup = require('flows/signup');
const invite = require('flows/invite');
const sequence = require('lib/sequence');
const getPhrase = require('lib/getPhrase');

const startGame = (players, return_game_phrase = false) => {
  return signup(players[0]).then(() => {
    return sequence(players.slice(1).map((player, i) => {
      return () => {
        const should_return_game_phrase = i === 0 && return_game_phrase;
        return invite(players[0], player, should_return_game_phrase);
      };
    }));
  }).then((messages) => {
    if ( return_game_phrase ) {
      return getPhrase(messages);
    }
  });
};

module.exports = startGame;
