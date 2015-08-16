var Q = require('q');
var squel = require('squel');

var db = require('db');
var User = require('./user');

var Game = {
  table: 'games',
  create: function(users) {
    var query = squel
                .insert()
                .into(this.table)
                .setFields(user);
    return db.query(query).then(function(game) {
      var game_id = game.insertId;
    }).fail(err) {
      console.error('error when creating game', err);
    });
  }
};

module.exports = Game;
