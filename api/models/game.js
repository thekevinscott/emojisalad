var Q = require('q');
var squel = require('squel').useFlavour('mysql');
var Promise = require('bluebird');
var _ = require('lodash');

var db = require('db');
var User;
var Round = require('./round');

var Game = {
  update: function(game, data) {
    var state_id = squel
                  .select()
                  .field('id')
                  .from('game_states')
                  .where('state=?',data.state);
    var query = squel
                .update()
                .table('games')
                .set('state_id', state_id)
                .where('id=?',game.id);
    return db.query(query);
  },
  getNextSubmitter: function(game) {
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
  /*
  checkGuess: function(game, user_id, guess) {
    if ( ! User ) {
      User = require('./user');
    }
    var query = squel
                .select()
                .field('p.phrase')
                .from('game_phrases', 'gp')
                .left_join('phrases', 'p', 'p.id=gp.phrase_id')
                .where('gp.game_id=?',game.id)
                .order('gp.created', false)
                .limit(1);

    return db.query(query).then(function(rows) {
      var result = guess.toLowerCase() == rows[0].phrase.toLowerCase();
      if ( result ) {
        // its a success!
        var promises = [];
        var nextSubmitter;
        for ( var i=0, l=game.players.length; i<l; i++ ) {
          promises.push(function() {
            var user = game.players[i];

            if ( user.state === 'waiting' ) {
              // then the next user will be the next player
              if ( game.players[i+1] ) {
                nextSubmitter = i+1;
              } else {
                // loop back to start
                nextSubmitter = 0;
              }
            }
            return User.update({ id: user.id }, { state: 'waiting-for-round' });
          }());
        }
        promises[nextSubmitter] = function() {
          return User.update( game.players[nextSubmitter], { state: 'waiting-for-submission' });
        }();

        return Promise.all(promises).then(function() {
          return result;
        });
      } else {
        return result;
      }
    }.bind(this));
  },
  */
 /*
  saveSubmission: function(user, message) {
    if ( ! User ) {
      User = require('./user');
    }
    return User.update(user, {
      state: 'waiting'
    }).then(function() {
      return this.getByUsers([user]);
    }.bind(this)).then(function(game) {
      return Promise.all(game.guessers.map(function(user) {
        // also update user states to guessing
        User.update(user, { state: 'guessing' });
      })).then(function() {
        return game;
      })
    });
    // should save teh submission AND update the user state
  },
  */
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
                .where('g.id=?', game.id);

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

        return db.query(query).then(function(attributes) {
          //console.log('got the attributes', attributes);
          attributes.map(function(attribute) {
            user[attribute.key] = attribute.attribute;
          });
          //console.log('the user afterwards', user);
          return user;
        });
      }));

    });
  },
  getRound: function(game) {
    var query = squel
                .select()
                .from('rounds')
                .where('game_id=?',game.id)
                .order('created')
    return db.query(query).then(function(rows) {
      if ( rows ) {
        return rows[0];
      } else {
        return null;
      }
    });
  },
  get: function(params) {
    var query = squel
                .select()
                .field('g.id')
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
        return Promise.join(
          this.getRound(game),
          this.getPlayers(game),
          function(round, players) {
            game.round = round;
            game.players = players;
            game.players.map(function(player) {
              //if ( player.id === game.round.submitter_id ) {
                //game.round.submitter = player;
              //}
            });
            return game;
          }
        );
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
    //.then(function() {
      //return this.getNextSubmitter(game);
    //}.bind(this));
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
    console.log('add user', user, 'to game', game);
    return this.getBattingOrder(game).then(function(order) {
      console.log('last', order);
      if ( order.length ) {
        var nextOrder = order.pop().order + 1;
      } else {
        var nextOrder = 0;
      }
      return this.addBatter(game, user, nextOrder);
    }.bind(this));
  },
  generateBattingOrder: function(game) {
    //console.log('generate batting order for game', game);
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
    //console.log(query.toString());
    return db.query(query);
  },
  add: function(game, users) {
    //console.log('**** NEED TO CHECK HERE - if a game is in progress, append them to the batting order', game);
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
        if ( game.state && game.state !== 'waiting-for-players' ) {
          // game is in progress
          this.addToBattingOrder(game, user);
        }
      }.bind(this));
    }.bind(this)));
  },
  create: function() {
    var query = squel
                .insert()
                .into('games', 'g')
                .setFields({ state_id: 1 });
    return db.query(query).then(function(rows) {
      return {
        id: rows.insertId
      }
    });
  }
};

module.exports = Game;
