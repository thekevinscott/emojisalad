var Q = require('q');
var squel = require('squel');

var db = require('db');
var User = require('./user');

var Game = {
  table: 'games',
  create: function() {
    var query = squel
                .insert()
                .into(this.table)
                .setFields(user);
    return db.query(query);
  }
};

module.exports = Game;
