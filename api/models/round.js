'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
const rule = require('config/rule');
const levenshtein = require('levenshtein');
const autosuggest = require('autosuggest');

const Player = require('./player');
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
  getClue: function(game, player) {
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
                                  player_id: player.id,
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
  checkGuess: Promise.coroutine(function* (game, player, guess) {
    let query = squel
                .select()
                .from('phrases')
                .where('id=?', game.round.phrase_id);

    function parsePhrase(phrase) {
      let p = phrase.split(' ').filter(function(word) {
        return ['the', 'of', 'a', 'an'].indexOf(word.toLowerCase()) === -1;
      }).join(' ');
      return p;
    }
                        
    let phrases = yield db.query(query.toString());

    const phrase = phrases[0].phrase;
    let result = rule('phrase', {phrase: parsePhrase(phrase)}).test(parsePhrase(guess));

    // check levenshtein as well, in case there's typos
    // but we limit it to a phrase of 5 characters or more.
    // cause anything shorter, typos are tough shit.
    if ( ! result && phrase.length > 5 ) {
      const distance = levenshtein(phrase, guess) / phrase.length;
      // accept it if its lower than a certain difference.
      if ( distance < .15 ) {
        result = true;
      }
    }

    if ( ! result ) {
      try {
        // finally, ping google and see what they say about this phrase
        // only check the first result though.
        let suggested_results = yield autosuggest(guess);
        if ( suggested_results.length ) {
          let top_result = suggested_results[0].result;
          result = rule('phrase', {phrase: parsePhrase(phrase)}).test(parsePhrase(top_result));
        }
      } catch (err) {
        console.error('google choked', err);
      }
    }

    // we save the guess
    let guessQuery = squel
                     .insert()
                     .into('guesses')
                     .setFields({
                       player_id: player.id,
                       round_id: game.round.id,
                       correct: (result) ? 1 : 0,
                       guess: guess
                     });

    yield db.query(guessQuery.toString());

    if ( result ) {
      let state_id = squel
                     .select()
                     .field('id')
                     .from('round_states')
                     .where('state=?', 'won');

      let update_rounds_query = squel
                                .update()
                                .table('rounds')
                                .set('winner_id',player.id)
                                .set('state_id',state_id)
                                .where('id=?',game.round.id);
      yield db.query(update_rounds_query.toString());
      return true;
    } else {
      return false;
    }
  }),
  getGuessesLeft: function(game, player) {
    var query = squel
                .select()
                .field('count(1) as guesses_made')
                .field('r.guesses')
                .from('rounds', 'r')
                .left_join('guesses', 'g', 'g.round_id=r.id')
                .where('r.id=?',game.round.id)
                .where('g.player_id=?',player.id);

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
  getLast: Promise.coroutine(function* (game) {
    let query = squel
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
                        
    let rounds = yield db.query(query);
    if ( rounds.length ) {
      var round = rounds[0];
      return round;
    } else {
      return null;
    }
  }),
  create: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }

    return Promise.join(
      Game.getNextSubmitter(game),
      this.getPhrase(game),
      function(submitter, phrase) {
        var state = 'waiting-for-submission';
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
  saveSubmission: function(game, player) {
    //if ( ! Player ) {
      //Player = require('./player');
    //}

    // all other players who are not submitter (not the player)
    // should be switched to guessing
    if ( game.round.players[0].id === player.id ) {
      throw "These should not match";
    }
    var promises = game.round.players.map(function(game_player) {
      return Player.update(game_player, {state: 'guessing' });
    });
    promises.push(function() {
      return Player.update(player, {state: 'submitted'});
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
