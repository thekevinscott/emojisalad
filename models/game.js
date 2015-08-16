var Q = require('q');
var squel = require('squel');

var db = require('db');
var User = require('./user');

var Game = {
  table: 'games',
  create: function(users) {
    console.log('create game');
    var query = squel
                .insert()
                .into(this.table)
                .setFields({ createdString: (new Date()).toString() });
                console.log(query.toString());

    return db.query(query).then(function(game) {
      var game_id = game.insertId;
      console.log('users', users);

      var rows = users.map(function(user) {
        return {
          game_id: game_id,
          user_id: user.id
        }
      });

      query = squel
              .insert()
              .into('game_participants')
              .setFieldsRows(rows);
              console.log(query.toString());
      return db.query(query);
    }).fail(function(err) {
      console.error('error when creating game', err);
    });
  }
};

module.exports = Game;
