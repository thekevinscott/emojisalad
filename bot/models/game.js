'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
const _ = require('lodash');
const emojiExists = require('emoji-exists');
const EmojiData = require('emoji-data');

const db = require('db');
const Player = require('./player');
const Round = require('./round');

// number of guesses a player gets per round
const default_guesses = 2;
const default_clues_allowed = 1;

const api = require('../service')('api');

squel.registerValueHandler(Date, (date) => {
  return '"' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '"';
});

const Game = {
  add: (game, users) => {
    return api('games', 'add', { users: users }, {
      game_id: game.id
    });
  },
  create: (params) => {
    return api('games', 'create', { users: params });
  },
  get: (params = {}) => {
    return api('games', 'get', params);
  }
};

module.exports = Game;
