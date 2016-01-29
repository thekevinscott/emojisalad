'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
const _ = require('lodash');
const emojiExists = require('emoji-exists');
const EmojiData = require('emoji-data');

const db = require('db');
const Player = require('./player');
const User = require('./user');
//const Round = require('./round');

// number of guesses a player gets per round
const default_guesses = 2;
const default_clues_allowed = 1;

squel.registerValueHandler(Date, function(date) {
  return '"' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '"';
});

let Game = {
  update: function(game, data) {
    let query = squel
              .update()
              .table('games')
              .set('id', game.id)
              .where('id=?',game.id);

    if ( data.state !== undefined ) {
      let state_id = squel
                    .select()
                    .field('id')
                    .from('game_states')
                    .where('state=?',data.state);
      query.set('state_id', state_id);
    }
    if ( data.random !== undefined ) {
      query.set('random', data.random);
    }

    return db.query(query);
  },
  getNextSubmitter: function(game) {
    return Promise.join(
      Round.getLast(game),
      this.getBattingOrder(game),
      function(round, order) {
        let next;
        if ( round ) {
          for ( let i=0,l=order.length; i<l; i++ ) {
            if ( order[i].player_id === round.submitter_id ) {
              if ( i < l-1 ) {
                // grab the next one
                next = order[i + 1];
              } else {
                next = order[0];
              }
              // else, just use the first player
              break;
            }
          }
        } else {
          next = order[0];
        }
        return Player.get({ id: next.player_id });
      }
    );
  },
  checkGuess: function(game, player, guess) {
    return Round.checkGuess(game, player, guess);
  },
  getGuessesLeft: function(game) {
    return Promise.all(game.round.players.map(function(game_player) {
      if ( game_player.state === 'passed' || game_player.state === 'lost' ) {
        return 0;
      } else {
        return Round.getGuessesLeft(game, game_player);
      }
    })).reduce(function(prev, current) {
      return prev + current;
    });
  },
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
  saveSubmission: Promise.coroutine(function* (player, message, game_number) {
    let game = yield this.get({ player: player, game_number: game_number });
    yield Round.saveSubmission(game, player, message);
    game.round.submission = message;
    return game;
  }),
  newRound: function(game) {
    console.debug('new round');
    return Round.create(game).then(function(round) {
      console.debug('round submitter', round.submitter.id, round.submitter.nickname);
      return Promise.all(game.players.map(function(game_player) {
        console.debug('player', game_player.id, game_player.nickname);
        let state;
        if ( game_player.id === round.submitter.id ) {
          state = 'waiting-for-submission';
        } else {
          state = 'waiting-for-round';
        }
        console.debug('expected state', state);
        return Player.update(game_player, {
          state: state,
        });
      })).then(function() {
        return round;
      });
    });
  },
  getPhrase: function(game) {
    let game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);
    let query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order('p.id')
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
  getPlayers: function(game) {

    let query = squel
                .select({ autoEscapeFieldNames: true })
                .field('p.id')
                .field('p.created')
                .field('n.number', 'to')
                .field('u.nickname')
                .field('u.avatar')
                .field('u.from')
                .field('u.from', 'number')
                .field('u.id', 'user_id')
                .field('s.state')
                .field('gp.score')
                .from('game_players', 'gp')
                .left_join('games', 'g', 'gp.game_id = g.id')
                .left_join('players', 'p', 'p.id = gp.player_id')
                .left_join('users', 'u', 'u.id = p.user_id')
                .left_join('player_states', 's', 's.id = p.state_id')
                .left_join('game_numbers', 'n', 'n.id = p.to')
                .where('g.id=?', game.id)
                .order('p.id');

    if ( game.round ) {
      let guesses = squel
                    .select()
                    .field('player_id')
                    .field('count(1) as guesses')
                    .from('guesses')
                    .where('round_id=?',game.round.id);
      query = query.left_join(guesses, 'e', 'e.player_id=p.id');
      query = query.field('COALESCE(e.guesses, 0) as guesses');
    }

    return db.query(query);
  },
  get: Promise.coroutine(function* (params, debug) {
    let games = yield this.getAll(params, debug);
    if ( games.length ) {
      let game = games[0];
      game.round = yield Round.getLast(game);
      game.players = yield this.getPlayers(game);

      if ( game.round ) {
        //console.debug('game round exists');
        game.players.map(function(game_player) {
          if ( game_player.id === game.round.submitter_id ) {
            game.round.submitter = game_player;
          } else {
            if ( ! game.round.players ) { game.round.players = []; }
            game.round.players.push(game_player);
          }
        });
      } else if ( game.state !== 'pending' ) {
        console.error(game);
        throw "Non pending games should have an associated round";
      }
      //console.debug('game returned', game);
      return game;
    } else {
      return null;
    }
  }),
  getAll: Promise.coroutine(function* (params, debug) {
    let query = squel
                .select()
                .field('g.id')
                .field('g.last_activity')
                .field('g.random')
                .field('s.state')
                .from('games', 'g')
                .left_join('game_players', 'p', 'p.game_id = g.id')
                .left_join('game_states', 's', 's.id = g.state_id')
                .left_join('players', 'u', 'u.id=p.player_id')
                .group('g.id')
                .order('g.created', false);

    if ( params.player ) {
      query.where('p.player_id=?',params.player.id);
    } else if ( params.id ) {
      query.where('g.id=?',params.id);
    }

    if ( params.last_activity ) {
      query.where('g.last_activity<?', params.last_activity);
    }

    //console.debug('params', params);
    console.debug(query.toString());

    let games = yield db.query(query.toString());
    if ( !games.length && debug ) {
      console.debug('no games found', query.toString());
    }
    //console.debug('games', games);
    return games;
  }),
  start: Promise.coroutine(function* (game) {
    return yield Promise.join(
      Game.newRound(game),
      this.update(game, {
        state: 'playing'
      }),
      this.generateBattingOrder(game),
      function(round) {
        game.round = round;
        return game;
      }
    );
  }),
  getBattingOrder: function(game) {
    let query = squel
                .select({ autoQuoteFieldNames: true })
                .field('player_id')
                .field('order')
                .from('player_order')
                .where('game_id=?',game.id);
    return db.query(query);
  },
  addToBattingOrder: function(game, player) {
    return this.getBattingOrder(game).then(function(order) {
      let nextOrder;
      if ( order.length ) {
        nextOrder = order.pop().order + 1;
      } else {
        nextOrder = 0;
      }
      return this.addBatter(game, player, nextOrder);
    }.bind(this));
  },
  generateBattingOrder: function(game) {
    return this.getPlayers(game).then(function(game_players) {
      return Promise.all(_.shuffle(game_players).map(function(game_player, i) {
        return this.addBatter(game, game_player, i);
      }.bind(this)));
    }.bind(this));
  },
  addBatter: function(game, player, order) {
    let query = squel
                .insert({ autoQuoteFieldNames: true })
                .into('player_order')
                .setFields({
                  game_id: game.id,
                  player_id: player.id,
                  order: order
                });
    return db.query(query);
  },
  /*
  add: function(game, players) {
    return Promise.all(players.map(function(player) {

      let row = {
        game_id: game.id,
        player_id: player.id,
      };

      let query = squel
                  .insert()
                  .into('game_players')
                  .setFields(row);

      return db.query(query.toString()).then(function(rows) {
        return {
          id: rows.insertId
        };
      }).then(function() {
        //if ( game.state && game.state !== 'waiting-for-players' ) {
          // game is in progress
        this.addToBattingOrder(game, player).then(function() {
        }).catch(function(err) {
          console.error('error adding player ot batting order',  player, err);
        });
        //}
      }.bind(this));
    }.bind(this)));
  },
  */
  /*
  create: function() {
    let state_id = squel
                  .select()
                  .field('id')
                  .from('game_states')
                  .where('state=?','pending');

    let query = squel
                .insert()
                .into('games', 'g')
                .setFields({
                  state_id: state_id,
                  guesses: default_guesses,
                  clues_allowed: default_clues_allowed,
                  created: squel.fval('NOW(3)'),
                  last_activity: squel.fval('NOW(3)')
                });
    let default_scores = {
      'pass': -1,
      'win-submitter-1': 3,
      'win-guesser-1': 2,
      'win-submitter-2': 2,
      'win-guesser-2': 1
    };

    return db.query(query.toString()).then(function(rows) {
      let game_score_query = squel
                             .insert({
                               autoQuoteFieldNames: true
                             })
                             .into('game_scores', 's')
                             .setFieldsRows(Object.keys(default_scores).map(function(key) {
                               return {
                                 game_id: rows.insertId,
                                 score: default_scores[key],
                                 key: key
                               };
                             }));
      return db.query(game_score_query.toString()).then(function() {
        return {
          id: rows.insertId
        };
      });
    });
  },
  */
  add: (game, users) => {
    return Promise.all(users.map((user) => {
      let player_params = {
        game_id: game.id,
        user_id: user.id,
      };
      if ( user.to ) {
        player_params.to = user.to;
      }
      return Player.create(player_params);
    })).then((players) => {
      return {
        id: game.id,
        players: players
      };
      /*
      return db.query(query.toString()).then(function(rows) {
        return {
          id: rows.insertId
        };
      }).then(function() {
        //if ( game.state && game.state !== 'waiting-for-players' ) {
          // game is in progress
        this.addToBattingOrder(game, player).then(function() {
        }).catch(function(err) {
          console.error('error adding player ot batting order',  player, err);
        });
        //}
      }.bind(this));
      */
    });
  },
  findOne: (params) => {
    if (parseInt(params)) {
      params = { id: params };
    }
    return Game.find(params).then((games) => {
      if ( games && games.length) {
        return games[0];
      } else {
        return {};
      }
    });
  },
  find: (params = {}) => {
    let query = squel
                .select()
                .from('games', 'g');

    if ( params.id ) {
      query = query.where('g.id=?',params.id);
    }

    return db.query(query).then((games) => {
      if ( games && games.length ) {
        return Player.find({ game_ids: games.map(game => game.id) }).then((players) => {
          return players.reduce((obj, player) => {
            const game_id = player.game_id;
            delete player.game_id;
            if ( ! obj[game_id] ) {
              obj[game_id] = [];
            }
            obj[game_id].push(player);
            return obj;
          }, {});
        }).then((players) => {
          return games.map((game) => {
            game.players = players[game.id] || [];
            game.rounds = [];
            return game;
          });
        });
      } else {
        return [];
      }
    });
  },
  create: (users) => {
    function getValidUsers(users) {
      return users.filter(user => parseInt(user.id));
    }
    if ( !_.isArray(users) ) {
      throw "You must provide an array of users";
    } else if ( getValidUsers(users).length !== users.length ) {
      // check to see if every user has a valid ID
      console.error('invalid parsed ids');
      throw "You must provide a valid user";
    } else {
      // check that every user is valid
      return Promise.all(users.map((user) => {
        return User.findOne(user.id);
      })).then((rows) => {
        if ( getValidUsers(rows).length !== users.length ) {
          console.error('invalid queried ids');
          throw "You must provide a valid user";
        }
      }).then(() => {
        let query = squel
                    .insert()
                    .into('games', 'g')
                    .setFields({
                      //clues_allowed: default_clues_allowed,
                      created: squel.fval('NOW(3)'),
                      last_activity: squel.fval('NOW(3)')
                    });

        return db.query(query);
      }).then(function(result) {
        if ( ! result || ! result.insertId ) {
          //console.error(query.toString());
          throw "There was an error inserting game";
        } else {
          return {
            id: result.insertId
          };
        }
      }).then((game) => {
        return Game.add(game, users);
      });
    }

  },
    /*
  updateScore: function(game, player, type) {
    let updates = [];
    if ( type === 'win-round' ) {
      let score_index = 1;
      game.players.map(function(game_player) {
        if ( player.id === game_player.id ) {
          score_index += game_player.guesses;
        }
      });

      updates.push({
        player_id: player.id,
        score: squel.select()
               .field('score').from('game_scores')
               .where('game_id=?',game.id)
               .where('`key`=?','win-guesser-'+score_index)
      });
      updates.push({
        player_id: game.round.submitter.id,
        score: squel.select()
               .field('score').from('game_scores')
               .where('game_id=?',game.id)
               .where('`key`=?','win-submitter-'+score_index)
      });
    } else if ( type === 'pass' ) {
      updates.push({
        player_id: player.id,
        score: squel.select()
               .field('score').from('game_scores')
               .where('game_id=?',game.id)
               .where('`key`=?','pass')
      });
    }

    return Promise.all(updates.map(function(data) {
      let query = squel
                  .update()
                  .table('game_players')
                  .set('score = score + ('+data.score+')')
                  .where('player_id=?',data.player_id)
                  .where('game_id=?',game.id);

      return db.query(query);
    })).then(function() {
      return this.get({ id: game.id });
    }.bind(this));
  },
  */
 /*
  updateDefaultScores: function(game, scores) {
    return Promise.all(Object.keys(scores).map(function(key) {
      let query = squel
                  .update()
                  .table('game_scores')
                  .set('score='+scores[key])
                  .where('game_id=?',game.id)
                  .where('`key`=?',key);

      return db.query(query.toString());
    }));
  }
  */
};

module.exports = Game;
