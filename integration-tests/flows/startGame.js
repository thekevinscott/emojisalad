'use strict';
//const _ = require('lodash');
//const Promise = require('bluebird');
//const setup = require('../lib/setup');
const signup = require('flows/signup');
const invite = require('flows/invite');
const sequence = require('lib/sequence');
//const getGame = require('lib/getGame');
//const setNonRandomGame = require('lib/setNonRandomGame');

const startGame = (players) => {
  return signup(players[0]).then(() => {
    return sequence(players.slice(1).map((player) => {
      return () => {
        return invite(players[0], player); 
      };
    }));
  });
}

module.exports = startGame;
