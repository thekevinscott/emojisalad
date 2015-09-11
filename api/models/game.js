var squel = require('squel').useFlavour('mysql');
var Promise = require('bluebird');
var _ = require('lodash');
var EmojiData = require('emoji-data');

var db = require('db');
var User;
var Round = require('./round');

// number of guesses a user gets per round
var default_guesses = 2;
var default_clues_allowed = 1;
var Game = {
  update: function(game, data) {
    var query = squel
              .update()
              .table('games')
              .set('id', game.id)
              .where('id=?',game.id);

    if ( data.state !== undefined ) {
      var state_id = squel
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
    if ( ! User ) {
      User = require('./user');
    }
    return Promise.join(
      Round.getLast(game),
      this.getBattingOrder(game),
      function(round, order) {
        var next;
        if ( round ) {
          for ( var i=0,l=order.length; i<l; i++ ) {
            if ( order[i].user_id === round.submitter_id ) {
              if ( i < l-1 ) {
                // grab the next one
                next = order[i + 1];
              } else {
                next = order[0];
              }
              // else, just use the first user
              break;
            }
          }
        } else {
          next = order[0];
        }
        return User.get({ id: next.user_id });
      }
    );
    return this.getPlayers(game).then(function(users) {
      return users[0];
      /*
      for ( var i=0, l=users.length; i < l; i++ ) {
        var user = users[i];
        if ( user.state === 'waiting' ) {
          // then the next user will be the next player
          if ( users[i+1] ) {
            return users[i+1];
          } else {
            // loop back to start
            return users[0];
          }
        }
      }
      */
    });
  },
  checkGuess: function(game, user, guess) {
    return Round.checkGuess(game, user, guess);
  },
  getGuessesLeft: function(game) {
    return Promise.all(game.round.players.map(function(player) {
      return Round.getGuessesLeft(game, player);
    })).reduce(function(prev, current) {
      return prev + current;
    });
  },
  checkInput: function(str) {
    var FBS_REGEXP = new RegExp("(?:" + (EmojiData.chars({
      include_variants: true
    }).join("|")) + ")", "g");

    str = str.replace(FBS_REGEXP, '').trim();
    if ( str.length > 0 ) {
      // this means non-emoji characters exist in the string
      return false;
    } else {
      return true;
    }
  },
  saveSubmission: function(user, message) {
    return this.get({ user: user }).then(function(game) {
      return Round.saveSubmission(game, user, message).then(function() {
        return game;
      });
    });
  },
  newRound: function(game) {
    return Round.create(game);
  },
  getPhrase: function(game) {
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
  getPlayers: function(game) {
    var query = squel
                .select()
                .field('u.id')
                .field('u.created')
                .field('s.state')
                .field('p.platform as platform')
                .from('game_participants', 'gp')
                .left_join('games', 'g', 'gp.game_id = g.id')
                .left_join('users', 'u', 'u.id = gp.user_id')
                .left_join('user_states', 's', 's.id = u.state_id')
                .left_join('platforms', 'p', 'p.id = u.platform_id')
                .where('g.id=?', game.id)
                .order('u.created');

    return db.query(query).then(function(users) {
      return Promise.all(users.map(function(user) {
        var query = squel
                    .select()
                    .field('a.attribute')
                    .field('k.`key`')
                    .from('user_attributes', 'a')
                    .left_join('users', 'u', 'u.id = a.user_id')
                    .left_join('user_attribute_keys', 'k', 'k.id = a.attribute_id')
                    //.where('k.`key`=?', key)
                    //.where('a.attribute=?', val)
                    .where('a.user_id=?',user.id);

        return Promise.join(
          db.query(query),
          function(attributes) {
            attributes.map(function(attribute) {
              user[attribute.key] = attribute.attribute;
            });
            return user;
          }
        );
      }.bind(this)));

    }.bind(this));
  },
  getRound: function(game) {
    return Round.getLast(game);
  },
  get: function(params) {
    var query = squel
                .select()
                .field('g.id')
                //.field('g.random')
                .field('s.state')
                .from('games', 'g')
                .left_join('game_participants', 'p', 'p.game_id = g.id')
                .left_join('game_states', 's', 's.id = g.state_id')
                .order('g.created', false)
                .limit(1);

    if ( params.user ) {
      query.where('p.user_id=?',params.user.id)
    } else if ( params.users ) {
      var user_ids = params.users.map(function(user) {
        return user.id;
      });
      query.where('p.user_id IN ? ',user_ids)
    } else if ( params.id ) {
      query.where('g.id=?',params.id);
    }
    
    return db.query(query.toString()).then(function(rows) {
      if ( rows.length ) {
        var game = rows[0];
        return this.getRound(game).then(function(round) {
          game.round = round;
          return this.getPlayers(game).then(function(players) {
            game.players = players;

            if ( game.round ) {
              game.players.map(function(player) {
                if ( player.id === game.round.submitter_id ) {
                  game.round.submitter = player;
                } else {
                  if ( ! game.round.players ) { game.round.players = []; }
                  game.round.players.push(player);
                }
              });
            }
            return game;
          });
        }.bind(this));
        /*
        return this.getRound(game).then(function(round) {
          game.round = round;
          return game;
        });
        /*
        return this.getPlayers(game).then(function(players) {
          game.players = players;
          if ( players.length > 1 ) {
            game.state = 'ready';
            game.guessers = [];
            for ( var i=0, l=players.length; i < l; i++ ) {
              var player = players[i];
              if ( player.state === 'waiting' ) {
                game.submitter = player;
              } else {
                game.guessers.push(player);
              }
            }
          } else {
            game.state = 'waiting-for-players';
            game.players = players;
          }
          return game;
        });
        */
      } else {
        return null;
      }
    }.bind(this));
  },
  start: function(game) {
    this.update(game, {
      state: 'playing'
    });
    return this.generateBattingOrder(game);
  },
  getBattingOrder: function(game) {
    var query = squel
                .select({ autoQuoteFieldNames: true })
                .field('user_id')
                .field('order')
                .from('player_order')
                .where('game_id=?',game.id);
    return db.query(query);
  },
  addToBattingOrder: function(game, user) {
    return this.getBattingOrder(game).then(function(order) {
      if ( order.length ) {
        var nextOrder = order.pop().order + 1;
      } else {
        var nextOrder = 0;
      }
      return this.addBatter(game, user, nextOrder);
    }.bind(this));
  },
  generateBattingOrder: function(game) {
    return this.getPlayers(game).then(function(players) {
      return Promise.all(_.shuffle(players).map(function(player, i) {
        return this.addBatter(game, player, i);
      }.bind(this)));
    }.bind(this));
  },
  addBatter: function(game, player, order) {
    var query = squel
    .insert({ autoQuoteFieldNames: true })
    .into('player_order')
    .setFields({
      game_id: game.id,
      user_id: player.id,
      order: order
    });
    return db.query(query);
  },
  add: function(game, users) {
    return Promise.all(users.map(function(user) {
      var row = {
        game_id: game.id,
        user_id: user.id
      };

      query = squel
              .insert()
              .into('game_participants')
              .setFields(row)

      return db.query(query).then(function(rows) {
        return {
          id: rows.insertId
        }
      }).then(function() {
        //if ( game.state && game.state !== 'waiting-for-players' ) {
          // game is in progress
          this.addToBattingOrder(game, user).then(function() {
          }).catch(function(err) {
            console.error('error adding user ot batting order',  user);
          });
        //}
      }.bind(this));
    }.bind(this)));
  },
  create: function() {
    var state_id = squel
                  .select()
                  .field('id')
                  .from('game_states')
                  .where('state=?','pending');

    var query = squel
                .insert()
                .into('games', 'g')
                .setFields({
                  state_id: state_id,
                  guesses: default_guesses,
                  clues_allowed: default_clues_allowed 
                });
    return db.query(query.toString()).then(function(rows) {
      return {
        id: rows.insertId
      }
    });
  }
};

module.exports = Game;
