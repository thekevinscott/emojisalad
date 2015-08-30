var _ = require('lodash');
var squel = require('squel');
var Promise = require('bluebird');

var db = require('db');

var User;
var Message = require('./message');
var Game;

var Round = {
  checkGuess: function(game, user, guess) {
    var query = squel
                .select()
                .from('phrases')
                .where('id=?', game.round.phrase_id);
                        
    return db.query(query.toString()).then(function(phrases) {
      var phrase = phrases[0].phrase;
      var regex = new RegExp('^'+phrase, 'i');
      if ( regex.test(guess) ) {
        var state_id = squel
                       .select()
                       .field('id')
                       .from('round_states')
                       .where('state=?', 'won');

        var query = squel
                    .update()
                    .table('rounds')
                    .set('winner_id',user.id)
                    .set('state_id',state_id)
                    .where('id=?',game.round.id);
        return db.query(query.toString()).then(function() {
          return true;
        });
      } else {
        return false;
      }
    });

  },
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
  getLast: function(game) {
    var query = squel
                .select()
                .from('rounds')
                .where('game_id=?',game.id)
                .order('id', false)
                .limit(1);
                        
    return db.query(query);
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
            state: state,
            players: game.players.filter(function(player) {
              if ( player.id !== submitter.id ) {
                return player;
              }
            })
          }
        });
      }
    );
  },
  saveSubmission: function(game, user, message) {
    if ( ! User ) {
      User = require('./user');
    }

    //console.log('game', game.round);
    //console.log('incoming user', user);
    // all other users who are not submitter (not the user)
    // should be switched to guessing
    if ( game.round.players[0].id === user.id ) {
      throw "These should not match";
    }
    var promises = game.round.players.map(function(player) {
      //console.log('player', player.id, 'guessing update');
      return User.update(player, {state: 'guessing' });
    });
    promises.push(function() {

      //console.log('player', user.id, 'submitted update');
      return User.update(user, {state: 'submitted'})
    }());
    return Promise.all(promises);
  }
}

module.exports = Round;
