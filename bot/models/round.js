'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
const rule = require('config/rule');
const levenshtein = require('levenshtein');
const autosuggest = require('autosuggest');
const api = require('../api');

const Player = require('./player');
let Game;
//let Game = require('./game');

let Round = {
  create: (game) => {
    return api('rounds', 'create', {}, {
      game_id: game.id
    });
  },
  update: (round, params) => {
    return api('rounds', 'update', params, { round_id: round.id });
  },
};

module.exports = Round;
