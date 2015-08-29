var _ = require('lodash');
var squel = require('squel');
var Promise = require('bluebird');

var db = require('db');

var User = require('./user');
var Message = require('./message');
var Game;

var Round = {
  getPhrase: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }
    var game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);
    var query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order('p.id')
                .limit(1);

    return db.query(query).then(function(rows) {
      if ( rows ) {
        var phrase = rows[0];
        // mark this phrase as used
        var markPhrase = squel
                         .insert()
                         .into('game_phrases')
                         .setFields({
                           game_id: game.id,
                           phrase_id: phrase.id
                         });
        db.query(markPhrase);
        return phrase;
      } else {
        console.error('Uh oh, out of phrases');
      }
    });
  },
  create: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }

    return Promise.join(
      Game.getNextSubmitter(game),
      this.getPhrase(game),
      function(submitter, phrase) {
        var state = 'pending';
        var state_id = squel
                       .select()
                       .field('id')
                       .from('round_states')
                       .where('state=?',state);

        var query = squel
                    .insert()
                    .into('rounds')
                    .setFields({
                      game_id: game.id,
                      state_id: state_id,
                      submitter_id: submitter.id,
                      phrase_id: phrase.id
                    });
        return db.query(query.toString()).then(function() {
          return {
            phrase: phrase.phrase,
            submitter: submitter,
            game: game,
            state: state
          }
        });
      }
    );
  }
}

module.exports = Round;
