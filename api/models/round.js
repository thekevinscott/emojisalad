'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
//const rule = require('config/rule');
const levenshtein = require('levenshtein');
const autosuggest = require('autosuggest');

const Player = require('./player');
//const Game = require('./game');
let Game;

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
    console.info('the guess', guess, 'phrases', phrases);

    const phrase = phrases[0].phrase;
    let result = rule('phrase', {phrase: parsePhrase(phrase)}).test(parsePhrase(guess));
    console.info('first test', result);

    // check levenshtein as well, in case there's typos
    // but we limit it to a phrase of 5 characters or more.
    // cause anything shorter, typos are tough shit.
    if ( ! result && phrase.length > 5 ) {
      const distance = levenshtein(phrase, guess) / phrase.length;
      // accept it if its lower than a certain difference.
      if ( distance <= .2 ) {
        result = true;
      }
      console.info('second test', result, distance);
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
        console.info('third test', result, suggested_results);
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
  /*
  */
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
                        
    let rounds = yield db.query(query);
    if ( rounds.length ) {
      let round = rounds[0];
      console.info('round', round);
      return round;
    } else {
      return null;
    }
  }),
  getPhrase: (game) => {
    let game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);

    let order = 'RAND()';

    let query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order(order)
                .limit(1);

    return db.query(query).then((rows) => {
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
        return db.query(markPhrase).then(() => {
          return phrase;
        });
      } else {
        console.error('Uh oh, out of phrases');
      }
    });
  },
  create: (game) => {
    if ( ! Game ) {
      Game = require('./game');
    }
    return Promise.join(
      Game.getNextSubmitter(game),
      Round.getPhrase(game),
      (submitter, phrase) => {
        let clues_allowed = squel
                      .select()
                      .field('clues_allowed')
                      .from('games')
                      .where('id=?',game.id);

        let guesses = squel
                      .select()
                      .field('guesses')
                      .from('games')
                      .where('id=?',game.id);

        let query = squel
                    .insert()
                    .into('rounds')
                    .setFields({
                      game_id: game.id,
                      submitter_id: submitter.id,
                      phrase_id: phrase.id,
                      created: squel.fval('NOW(3)'),
                    });
        return db.query(query.toString()).then((result) => {
          const created = new Date();
          const round_id = result.insertId;
          let players = [];
          if ( game.players ) {
            players = game.players.filter((player) => {
              if ( player.id !== submitter.id ) {
                return player;
              }
            });
          }

          return {
            id: round_id,
            game_id: game.id,
            created: created,
            phrase: phrase.phrase,
            submission: '',
            submitter: submitter,
            players: players
          };
        });
      }
    );
  },
  findOne: (params) => {
    if (parseInt(params)) {
      params = { id: params };
    }
    return Round.find(params).then((rounds) => {
      if ( rounds && rounds.length) {
        return rounds[0];
      } else {
        return {};
      }
    });
  },
  find: (params = {}) => {
    let query = squel
                .select()
                .field('r.id')
                .field('r.submitter_id')
                .field('r.phrase_id')
                .field('r.winner_id')
                .field('r.game_id')
                .field('r.created')
                //.field('r.guesses')
                //.field('r.clues_allowed')
                //.field('n.submission')
                .field('r.submission')
                .field('p.phrase')
                .from('rounds', 'r')
                //.left_join('guesses', 'g', 'g.round_id=r.id')
                .left_join('phrases', 'p', 'p.id=r.phrase_id')
                //.left_join('submissions', 'n', 'n.round_id=r.id')
                .order('r.created, r.id');
                //.limit(1);
    if ( params.id ) {
      query = query
              .where('r.id=?',params.id); 
    }
                        
    if ( params.game_id ) {
      query = query
              .where('r.game_id = ?',params.game_id); 
    } else if ( params.game_ids ) {
      query = query
              .where('r.game_id IN ?',params.game_ids); 
    }

    return db.query(query).then((rounds) => {
      if ( rounds.length ) {
        if ( params.most_recent ) {
          const rounds_by_game_id = rounds.reduce((obj, round) => {
            obj[round.game_id] = round;
            return obj;
          }, {});
          return Object.keys(rounds_by_game_id).map((game_id) => {
            return rounds_by_game_id[game_id];
          });
        } else {
          return rounds;
        }
      } else {
        return [];
      }
    }).map((round) => {
      return Promise.join(
        Player.find({ game_id: round.game_id }),
        (players) => {
          const submitter = players.filter((player) => {
            return player.id === round.submitter_id;
          })[0];
          return {
            id: round.id,
            game_id: round.game_id,
            phrase: round.phrase,
            submitter: submitter,
            submission: round.submission,
            players: players.filter((player) => {
              return player.id !== round.submitter_id;
            }),
            created: round.created
          };
        }
      );
    });
  },
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
  update: (params, data = {}) => {
    return new Promise((resolve) => {
      if ( params.game_id ) {
        resolve(Game.findOne({ id: params.game_id }));
      } else {
        resolve();
      }
    }).then((game) => {
      return Round.findOne(params).then((round) => {
        if ( round && round.id ) {
          if ( ! game || (game && game.id === round.game_id) ) {
            let query = squel
                        .update()
                        .table('rounds', 'r')
                        .set('last_activity', squel.fval('NOW(3)'))
                        .where('r.id=?',round.id);

            if ( data.submission ) {
              query = query.set('submission', data.submission);
            }

            //console.debug('**** DID YA CALL SET');
            return db.query(query).then((result) => {
              return Round.findOne(round);
            }).catch((err) => {
              console.error('err', err);
            });
          } else {
            console.error('**** GAME ID DOES NOT MATCH', game, round);
            throw new Error("Game ID does not match round ID");
          }
        } else {
          throw new Error("No matching Round ID found");
        }
      });
    });
  }
};

module.exports = Round;
