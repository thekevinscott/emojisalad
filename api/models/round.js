'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
const rule = require('config/rule');

const User = require('./user');
var Game;
//let Game = require('./game');

var Round = {
  getCluesLeft: function(game) {
    var clue_query = squel
                     .select()
                     .field('count(1) as cnt')
                     .from('round_clues')
                     .where('round_id=?',game.round.id);
    return db.query(clue_query).then(function(rows) {
      return game.round.clues_allowed - rows[0].cnt;
    });
  },
  getClue: function(game, user) {
    var clue_query = squel
                     .select()
                     .field('clue_id')
                     .from('round_clues')
                     .where('round_id=?',game.round.id);

    var select_query = squel
                .select()
                .field('c.id as clue_id')
                .field('c.clue')
                .field('c.phrase_id')
                .from('clues', 'c')
                .left_join('phrases','p','c.phrase_id=p.id')
                .where('p.id=?', game.round.phrase_id)
                .where('c.id NOT IN ?', clue_query)
                .limit(1);


    return db.query(select_query.toString()).then(function(rows) {
      var clue = rows[0];
      if ( clue ) {
        var update_clue_query = squel
                                .insert()
                                .into('round_clues')
                                .setFields({
                                  user_id: user.id,
                                  round_id: game.round.id,
                                  clue_id: clue.clue_id
                                });

        db.query(update_clue_query);
        return clue;
      } else {
        return null;
      }
    });
  },
  checkGuess: function(game, user, guess) {
    let query = squel
                .select()
                .from('phrases')
                .where('id=?', game.round.phrase_id);
                        
    return db.query(query.toString()).then(function(phrases) {
      const phrase = phrases[0].phrase;
      const result = rule('phrase', {phrase: phrase}).test(guess);

      // we save the guess
      let guessQuery = squel
                       .insert()
                       .into('guesses')
                       .setFields({
                         user_id: user.id,
                         round_id: game.round.id,
                         correct: (result) ? 1 : 0,
                         guess: guess
                       });
      db.query(guessQuery.toString());

      if ( result ) {
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
  getGuessesLeft: function(game, user) {
    var query = squel
                .select()
                .field('count(1) as guesses_made')
                .field('r.guesses')
                .from('rounds', 'r')
                .left_join('guesses', 'g', 'g.round_id=r.id')
                .where('r.id=?',game.round.id)
                .where('g.user_id=?',user.id);

    return db.query(query).then(function(rows) {
      var row = rows.pop();
      return parseInt(row.guesses) - parseInt(row.guesses_made);
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

    var order;
    if ( game.random ) {
      order = 'RAND()';
    } else {
      order = 'p.id';
    }

    var query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order(order)
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
                .field('r.id')
                .field('r.submitter_id')
                .field('r.phrase_id')
                .field('r.winner_id')
                .field('r.created')
                .field('r.guesses')
                .field('r.clues_allowed')
                //.field('COUNT(1) as guesses_made')
                .field('p.phrase')
                .field('s.state')
                .from('rounds', 'r')
                //.left_join('guesses', 'g', 'g.round_id=r.id')
                .left_join('round_states', 's', 's.id=r.state_id')
                .left_join('phrases', 'p', 'p.id=r.phrase_id')
                .where('r.game_id=?',game.id)
                .order('r.id', false)
                //.group('r.id')
                .limit(1);
                        
    return db.query(query).then(function(rounds) {
      if ( rounds.length ) {
        var round = rounds[0];
        //round.guesses_left = round.guesses - round.guesses_made;
        //delete round.guesses_made;
        return round;
      } else {
        return null;
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

        var clues_allowed = squel
                      .select()
                      .field('clues_allowed')
                      .from('games')
                      .where('id=?',game.id);

        var guesses = squel
                      .select()
                      .field('guesses')
                      .from('games')
                      .where('id=?',game.id);

        var query = squel
                    .insert()
                    .into('rounds')
                    .setFields({
                      game_id: game.id,
                      state_id: state_id,
                      submitter_id: submitter.id,
                      phrase_id: phrase.id,
                      guesses: guesses,
                      clues_allowed: clues_allowed
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
          };
        });
      }
    );
  },
  saveSubmission: function(game, user) {
    //if ( ! User ) {
      //User = require('./user');
    //}

    // all other users who are not submitter (not the user)
    // should be switched to guessing
    if ( game.round.players[0].id === user.id ) {
      throw "These should not match";
    }
    var promises = game.round.players.map(function(player) {
      return User.update(player, {state: 'guessing' });
    });
    promises.push(function() {
      return User.update(user, {state: 'submitted'});
    }());
    promises.push(function() {
      return this.update(game.round, { state: 'playing' });
    }.bind(this)());
    return Promise.all(promises);
  },
  update: function(round, data) {
    var query = squel
                .update()
                .table('rounds', 'r')
                .where('r.id=?',round.id);
    if ( data.state ) {
      var state_id = squel
                     .select()
                     .field('id')
                     .from('round_states')
                     .where('state=?',data.state);
      query.set('state_id', state_id);
    } else if ( data.clues_allowed ) {
      query.set('clues_allowed', data.clues_allowed);
    }

    return db.query(query.toString());
  }
};

module.exports = Round;
