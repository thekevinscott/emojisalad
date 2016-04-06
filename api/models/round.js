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

const Round = {
  getCluesLeft: (game) => {
    const clue_query = squel
                       .select()
                       .field('count(1) as cnt')
                       .from('round_clues')
                       .where('round_id=?',game.round.id);
    return db.query(clue_query).then((rows) => {
      return game.round.clues_allowed - rows[0].cnt;
    });
  },
  /*
  getClue: Promise.coroutine(function* (game, player) {
    const clue_query = squel
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
      //return clue;
    //} else {
      //return null;
    //}
  }),
  */

  parsePhrase: (phrase) => {
    const ignored_words = [
      'the',
      'of',
      'a',
      'an',
      'for',
      'and'
    ];
    return phrase.toLowerCase().replace(/[^\w\s]|_/g, '').split(' ').filter((word) => {
      return ignored_words.indexOf(word.toLowerCase()) === -1 && word;
    }).join(' ');
  },
  checkPhrase: (phrase, guess) => {
    // check distance of phrase
    //const levenshtein_distance = levenshtein(phrase, guess);
    const distance = levenshtein(phrase, guess) / phrase.length;
    //const acceptable_distance = 6;
    //return levenshtein_distance <= acceptable_distance;
    return distance <= 0.31;
  },
  guess: (round, player, original_guess) => {
    return Round.findOne(round).then((round) => {
      const phrase = Round.parsePhrase(round.phrase);
      const guess = Round.parsePhrase(original_guess);

      return new Promise((resolve) => {
        if ( Round.checkPhrase(phrase, guess) ) {
          resolve(true);
        } else {
          // could also check bing here
          //
          // finally, ping google and see what they say about this phrase
          // only check the first result though.
          resolve(autosuggest(guess).then((suggested_results) => {
            if ( suggested_results.length ) {
              const top_result = Round.parsePhrase(suggested_results[0].result);
              return Round.checkPhrase(phrase, top_result);
            } else {
              return false;
            }
          }).catch(() => {
            // swallow this silently
            return false;
          }));
        }
      }).then((result) => {
        const promises = [];
        // we save the guess
        const guess_query = squel
                           .insert()
                           .into('guesses')
                           .setFields({
                             player_id: player.id,
                             round_id: round.id,
                             correct: result,
                             guess: original_guess
                           });
        promises.push(db.query(guess_query));

        if ( result ) {
          const update_rounds_query = squel
                                      .update()
                                      .table('rounds')
                                      .set('winner_id',player.id)
                                      .where('id=?',round.id);
          promises.push(db.query(update_rounds_query));
        }

        return Promise.all(promises).then(() => {
          return Round.findOne(round);
        });
      });
    });
  },
  /*
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
    const rounds = yield db.query(query);
    if ( rounds.length ) {
      const round = rounds[0];
      console.info('round', round);
      return round;
    } else {
      return null;
    }
  }),
  */
  getPhrase: (game) => {
    const game_phrases = squel
                         .select()
                         .field('phrase_id')
                         .from('game_phrases')
                         .where('game_id=?', game.id);

    const order = 'RAND()';

    const query = squel
                  .select()
                  .field('p.id')
                  .field('p.phrase')
                  .field('c.clue')
                  .from('phrases', 'p')
                  .left_join('clues', 'c', 'c.phrase_id=p.id')
                  .field('p.phrase')
                  .field('p.id')
                  .where('p.id NOT IN ?', game_phrases)
                  .order(order)
                  .limit(1);

    console.info('get phrase 1');
    return db.query(query).then((rows) => {
      console.info('get phrase 2');
      if ( rows ) {
        console.info('get phrase 3');
        const phrase = rows[0];
        // mark this phrase as used
        const markPhrase = squel
                           .insert()
                           .into('game_phrases')
                           .setFields({
                             game_id: game.id,
                             phrase_id: phrase.id
                           });
        console.info('get phrase 4');
        return db.query(markPhrase).then(() => {
          console.info('get phrase 5');
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
    console.info('create new round');
    return Promise.join(
      Game.getNextSubmitter(game),
      Round.getPhrase(game),
      (submitter, phrase) => {
        console.info('got submitter', submitter);
        //const clues_allowed = squel
                              //.select()
                              //.field('clues_allowed')
                              //.from('games')
                              //.where('id=?',game.id);

        //const guesses = squel
                        //.select()
                        //.field('guesses')
                        //.from('games')
                        //.where('id=?',game.id);

        const query = squel
                      .insert()
                      .into('rounds')
                      .setFields({
                        game_id: game.id,
                        submitter_id: submitter.id,
                        phrase_id: phrase.id,
                        created: squel.fval('NOW(3)')
                      });

        console.info('query', query.toString());
        return db.query(query.toString()).then((result) => {
          console.info('created the new round');
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

          const round = {
            id: round_id,
            game_id: game.id,
            clue: phrase.clue,
            created,
            phrase: phrase.phrase,
            submission: '',
            submitter,
            players
          };
          console.info('the round payload', round);

          return round;
        });
      }
    );
  },
  findOne: (params) => {
    console.info('prepare to find a single round', params);
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
                .field('r.submission')
                .field('p.phrase')
                .field('c.clue')
                .from('rounds', 'r')
                .left_join('phrases', 'p', 'p.id=r.phrase_id')
                .left_join('clues', 'c', 'c.phrase_id=p.id')
                //.left_join('submissions', 'n', 'n.round_id=r.id')
                .order('r.created, r.id');
                //.group('r.id')
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
    }).then((rounds) => {

      if ( rounds.length ) {
        const round_ids = rounds.map((round) => {
          return round.id;
        });

        const guesses_query = squel
                              .select()
                              .field('guess')
                              .field('player_id')
                              .field('round_id')
                              .from('guesses', 'g')
                              .where('round_id IN ?', round_ids);

        return db.query(guesses_query).then((guesses) => {
          return guesses.reduce((obj, guess) => {
            const round_id = guess.round_id;
            if ( ! obj[round_id] ) {
              obj[round_id] = [];
            }
            obj[round_id].push({
              guess: guess.guess,
              player_id: guess.player_id
            });
            return obj;
          }, {});
        }).then((guesses_by_round_id) => {
          return Promise.all(
            rounds.map((round) => {
              return Promise.join(
                Player.find({ game_id: round.game_id }),
                (players) => {
                  const submitter = players.filter((player) => {
                    return player.id === round.submitter_id;
                  })[0];

                  const winner = players.filter((player) => {
                    return player.id === round.winner_id;
                  })[0];
                  return {
                    id: round.id,
                    game_id: round.game_id,
                    phrase: round.phrase,
                    clue: round.clue,
                    submitter,
                    guesses: guesses_by_round_id[round.id],
                    winner: winner || null,
                    submission: round.submission,
                    players: players.filter((player) => {
                      return player.id !== round.submitter_id;
                    }),
                    created: round.created
                  };
                }
              );
            })
          );
        });
      } else {
        return [];
      }
    });
  },
  /*
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
    const query = squel
                  .insert()
                  .into('submissions')
                  .setFields({
                    submission,
                    round_id: game.round.id,
                    player_id: player.id
                  });

    yield db.query(query);
  }),
  */
  update: (params, data = {}) => {
    if ( ! params.id ) {
      throw "You must provide a round id to update by";
    }
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

            if ( data.phrase_id ) {
              query = query.set('phrase_id', data.phrase_id);
            }

            return db.query(query).then(() => {
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
