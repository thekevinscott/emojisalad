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

let Emoji = {
  checkInput: function(str) {
    if ( str === '' ) {
      return 'text';
    } else if ( emojiExists(str) ) {
      return 'emoji';
    } else if ( EmojiData.scan(str).length > 0 ) {
      return 'mixed-emoji';
    } else {
      return 'text';
    }
  },
  getNumOfEmoji: function(str) {
    return EmojiData.scan(str).length;
  }
};

module.exports = Emoji;
