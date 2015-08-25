var Q = require('q');
var squel = require('squel');

var db = require('db');
var User = require('./user');

var Game = {
  notify: function(user) {
    return this.getByUsers([user]).then(function(game) {
      if ( game ) {
        console.log('game', game);
        // we need at least two players to be ready
        
        if ( game.players && game.players.length ) {
          for ( var i=0,l=game.players.length;i<l;i++ ) {
            var player = game.players[i];
            console.log('player', player);
          }
        }
      }
    });
  },
  getPlayers: function(game) {
    var query = squel
                .select()
                .field('u.id')
                .field('u.username')
                .field('u.created')
                .field('s.state')
                .field('p.platform as platform')
                .from('game_participants', 'gp')
                .left_join('games', 'g', 'gp.game_id = g.id')
                .left_join('users', 'u', 'u.id = gp.user_id')
                .left_join('user_states', 's', 's.id = u.state_id')
                .left_join('platforms', 'p', 'p.id = u.platform_id')
                .where('g.id=?', game.id);

    return db.query(query);
  },
  getByUsers: function(users) {
    var dfd = Q.defer();
    var user_ids = users.map(function(user) {
      return user.id;
    });

    var query = squel
                .select()
                .field('g.id')
                .field('s.state')
                .from('games', 'g')
                .left_join('game_participants', 'p', 'p.game_id = g.id')
                .left_join('game_states', 's', 's.id = g.state_id')
                .where('p.user_id IN ? ',user_ids)
                .order('g.created', false)
                .limit(1);
    db.query(query).then(function(rows) {
      if ( rows.length ) {
        var game = rows[0];
        this.getPlayers(game).then(function(players) {
          game.players = players;
          dfd.resolve(game);
        }).fail(dfd.reject);
      } else {
        dfd.resolve(null);
      }
    }.bind(this)).fail(dfd.reject);
    return dfd.promise;
  },
  add: function(users) {
    function addUsersToGame(game, users) {
      var rows = users.map(function(user) {
        return {
          game_id: game.id,
          user_id: user.id
        }
      });

      query = squel
              .insert()
              .into('game_participants')
              .setFieldsRows(rows);

      return db.query(query).then(function(rows) {
        return {
          id: rows.insertId
        }
      });
    }
    // does a game exist for one of these users yet?
    return this.getByUsers(users).then(function(game) {
      if ( game ) {
        return addUsersToGame(game, users);
      } else {
        // create a game
        return this.create().then(function(game) {
          return addUsersToGame(game, users);
        });
      }
    }.bind(this));
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
  /*
  table: 'games',
  update: function(user_id) {

    var query = squel
                .select()
                .field('g.id')
                .from('games', 'g')
                .left_join('game_participants', 'p', 'p.game_id = g.id')
                .where('p.user_id=?',user_id)
                .order('g.created', false)
                .limit(1);

    return db.query(query).then(function(games) {
      if ( games.length ) {
        var game = games[0];
        // grab all the participants in a particular game
        var participants_query = squel
                                  .select()
                                  .field('g.id', 'game_id')
                                  .field('u.*')
                                  .field('s.state')
                                  .from('game_participants', 'p')
                                  .left_join('games', 'g', 'p.game_id = g.id')
                                  .left_join('users', 'u', 'u.id = p.user_id')
                                  .left_join('user_states', 's', 's.id = u.state_id')
                                  .where('g.id=?',game.id);
        return db.query(participants_query);
      } else {
        throw "No games found, wtf is going on" + query.toString();
      }
    }).then(function(users) {
      var pending_users = users.filter(function(user) {
        if ( user.state === 'created' || user.state === 'invited' ) {
          return true;
        } else {
          return false;
        }
      });

      if ( pending_users.length ) {
        console.log('there are still pending users', pending_users);
      } else {
        Game.start(users[0].game_id);
      }
    });
  },
  start: function(game_id) {
    var in_progress = squel
                      .select()
                      .field('id')
                      .from('game_states')
                      .where('state="in_progress"');

    var query = squel
                .update()
                .table('games')
                .set('state_id', in_progress);

    return db.query(query.toString());
  },
  create: function(users) {
    console.log('create game');
    function addParticipants(game_id, usersToExclude) {
      if ( ! usersToExclude ) { usersToExclude = []; }
      console.log('add participarnts');
      console.log('users', users);

      console.log('users to exclude', usersToExclude);
      var rows = users.map(function(user) {
        return {
          game_id: game_id,
          user_id: user.id
        }
      }).filter(function(row) {
        if ( usersToExclude.indexOf(row.user_id) !== -1 ) {
          return false;
        } else {
          return true;
        }
      });

      if ( rows.length ) {
        query = squel
                .insert()
                .into('game_participants')
                .setFieldsRows(rows);

        return db.query(query);
      } else {
        return Q.resolve(true);
      }
    }

    var game_query = squel
                     .select()
                     .field('g.id', 'game_id')
                     .field('p.user_id')
                     .from('games', 'g')
                     .left_join('game_participants', 'p', 'p.game_id = g.id')
                     .where('p.user_id IN ?', users.map(function(user) {
                       return user.id;
                     }));

    return db.query(game_query).then(function(games) {
      if ( games.length ) {
        var usersToExclude = games.map(function(row) {
          return row.user_id;
        });
        // game already exists, just add onto it
        return addParticipants(games[0].game_id, usersToExclude);
      } else {
        var query = squel
                    .insert()
                    .into('games', 'g')
                    .setFields({ state_id: 1 });
        return db.query(query).then(function(game) {
          return addParticipants(game.insertId);
        }).fail(function(err) {
          console.error('error when creating game', err);
        });
      }
    });

  }
*/
};

module.exports = Game;
