'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
//const _ = require('lodash');
const emojiExists = require('emoji-exists');
const EmojiData = require('emoji-data');

const db = require('db');
//const Player = require('./player');
//const Round = require('./round');

// number of guesses a player gets per round
//const default_guesses = 2;
//const default_clues_allowed = 1;

const Emoji = {
  check: (str) => {
    return new Promise((resolve) => {
      if ( str === '' ) {
        resolve({ type: 'text' });
      } else {
        const does_emoji_exist = emojiExists(str);
        if ( does_emoji_exist ) {
          const number = Emoji.getNumOfEmoji(str);
          resolve({ type: 'emoji', number });
        } else if ( EmojiData.scan(str).length > 0 ) {
          resolve({ type: 'mixed' });
        } else {
          resolve({ type: 'text' });
        }
      }
    });
  },
  getNumOfEmoji: (str) => {
    return emojiExists.number(str);
    //return EmojiData.scan(str).length;
  },
  getRandom: () => {
    const query = squel
                  .select()
                  .field('emoji')
                  .from('emojis')
                  .order('rand()')
                  .limit(1);

    return db.query(query).then((rows) => {
      return rows[0];
    });
  }
};

module.exports = Emoji;
