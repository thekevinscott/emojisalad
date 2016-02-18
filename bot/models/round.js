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
  getCluesLeft: function(game) {
    let clue_query = squel
                     .select()
                     .field('count(1) as cnt')
                     .from('round_clues')
                     .where('round_id=?',game.round.id);
    return db.query(clue_query).then(function(rows) {
      return game.round.clues_allowed - rows[0].cnt;
    });
  },
  getClue: Promise.coroutine(function* (game, player) {
    let clue_query = squel
                     .select()
                     .field('clue_id')
                     .from('round_clues')
                     .where('round_id=?',game.round.id);

    let select_query = squel
                .select()
                .field('c.id as clue_id')
                .field('c.clue')
                .field('c.phrase_id')
                .from('clues', 'c')
                .left_join('phrases','p','c.phrase_id=p.id')
                .where('p.id=?', game.round.phrase_id)
                .where('c.id NOT IN ?', clue_query)
                .limit(1);


    let rows = yield db.query(select_query.toString());
    return rows[0];
    //let clue = rows[0];

    //if ( clue ) {
      /*
      let update_clue_query = squel
                              .insert()
                              .into('round_clues')
                              .setFields({
                                player_id: player.id,
                                round_id: game.round.id,
                                clue_id: clue.clue_id
                              });

      db.query(update_clue_query);
      */
      //return clue;
    //} else {
      //return null;
    //}
  }),
  checkGuess: Promise.coroutine(function* (game, player, guess) {
      //console.log('super mario bros', levenshtein('super mario brothers', 'super mario bros') / 'super mario brothers'.length);
    let query = squel
                .select()
                .from('phrases')
                .where('id=?', game.round.phrase_id);

    function parsePhrase(phrase) {
      let p = phrase.replace(/[^\w\s]|_/g, '').split(' ').filter(function(word) {
        return ['the', 'of', 'a', 'an'].indexOf(word.toLowerCase()) === -1 && word;
      }).join(' ');
      return p;
    }
                        
    let phrases = yield db.query(query.toString());
    console.debug('the guess', guess, 'phrases', phrases);

    const phrase = phrases[0].phrase;
    let result = rule('phrase', {phrase: parsePhrase(phrase)}).test(parsePhrase(guess));
    console.debug('first test', result);

    // check levenshtein as well, in case there's typos
    // but we limit it to a phrase of 5 characters or more.
    // cause anything shorter, typos are tough shit.
    if ( ! result && phrase.length > 5 ) {
      const distance = levenshtein(phrase, guess) / phrase.length;
      // accept it if its lower than a certain difference.
      if ( distance <= .2 ) {
        result = true;
      }
      console.debug('second test', result, distance);
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
        console.debug('third test', result, suggested_results);
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

    yield db.query(guessQuery);

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
  //getGuessesLeft: function(game, player) {
    //let query = squel
                //.select()
                //.field('count(1) as guesses_made')
                //.field('r.guesses')
                //.from('rounds', 'r')
                //.left_join('guesses', 'g', 'g.round_id=r.id')
                //.where('r.id=?',game.round.id)
                //.where('g.player_id=?',player.id);

    //return db.query(query).then(function(rows) {
      //let row = rows.pop();
      //return parseInt(row.guesses) - parseInt(row.guesses_made);
    //});
  //},
  getPhrase: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }
    let game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);

    let order;
    if ( game.random ) {
      order = 'RAND()';
    } else {
      order = 'p.id';
    }

    let query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order(order)
                .limit(1);

    return db.query(query).then(function(rows) {
      if ( rows ) {
        let phrase = rows[0];
        // mark this phrase as used
        let markPhrase = squel
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
                .field('n.submission')
                //.field('COUNT(1) as guesses_made')
                .field('p.phrase')
                .field('s.state')
                .from('rounds', 'r')
                //.left_join('guesses', 'g', 'g.round_id=r.id')
                .left_join('round_states', 's', 's.id=r.state_id')
                .left_join('phrases', 'p', 'p.id=r.phrase_id')
                .left_join('submissions', 'n', 'n.round_id=r.id')
                .where('r.game_id=?',game.id)
                .order('r.id', false)
                //.group('r.id')
                .limit(1);
                        
                //console.log(query.toString());
    let rounds = yield db.query(query);
    if ( rounds.length ) {
      let round = rounds[0];
      console.debug('round', round);
      return round;
    } else {
      return null;
    }
  }),
  create: (game) => {
    return api('rounds', 'create', {}, {
      game_id: game.id
    });
  },
  //create: function(game) {
    //if ( ! Game ) {
      //Game = require('./game');
    //}

    //return Promise.join(
      //Game.getNextSubmitter(game),
      //this.getPhrase(game),
      //function(submitter, phrase) {
        //let state = 'waiting-for-submission';
        //let state_id = squel
                       //.select()
                       //.field('id')
                       //.from('round_states')
                       //.where('state=?',state);

        //let clues_allowed = squel
                      //.select()
                      //.field('clues_allowed')
                      //.from('games')
                      //.where('id=?',game.id);

        //let guesses = squel
                      //.select()
                      //.field('guesses')
                      //.from('games')
                      //.where('id=?',game.id);

        //let query = squel
                    //.insert()
                    //.into('rounds')
                    //.setFields({
                      //game_id: game.id,
                      //state_id: state_id,
                      //submitter_id: submitter.id,
                      //phrase_id: phrase.id,
                      //guesses: guesses,
                      //clues_allowed: clues_allowed
                    //});
        //return db.query(query.toString()).then(function() {
          //return {
            //phrase: phrase.phrase,
            //submitter: submitter,
            //game: game,
            //state: state,
            //players: game.players.filter(function(player) {
              //if ( player.id !== submitter.id ) {
                //return player;
              //}
            //})
          //};
        //});
      //}
    //);
  //},
  saveSubmission: Promise.coroutine(function* (game, player, submission) {

    // all other players who are not submitter (not the player)
    // should be switched to guessing
    if ( game.round.players[0].id === player.id ) {
      throw "These should not match";
    }
    let promises = game.round.players.map(function(game_player) {
      if ( game_player.id !== player.id ) {
        return Player.update(game_player, {state: 'guessing' });
      } else {
        return Player.update(player, {state: 'submitted'});
      }
    });
    yield Promise.all(promises);
    yield this.update(game.round, { state: 'playing' });
    let query = squel
                .insert()
                .into('submissions')
                .setFields({
                  submission: submission,
                  round_id: game.round.id,
                  player_id: player.id
                });

    yield db.query(query);
  }),
  update: function(round, data) {
    let query = squel
                .update()
                .table('rounds', 'r')
                .where('r.id=?',round.id);
    if ( data.state ) {
      let state_id = squel
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
