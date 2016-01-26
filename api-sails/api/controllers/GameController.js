/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

module.exports = {
  create: function( req, res ) {
    return Game.create({})
    .exec(function(err, game) {
      if (err) {
        return res.json(err, 400);
      } else {
        return Round.create({ game: game })
        .exec(function(err, round) {
          if (err) {
            return res.json(err, 400);
          } else {
            game.rounds.add(round);
            return game.save(function() {
              res.json(game);
            });
          }
        });
      }
    });
  },
  destroy: function(req,res){
    return Game.update({ id: req.param('id') }, { archived: true })
    .exec(function (err, game) {
      if (err) return res.json(err, 400);
      return res.json(game[0]);
    });
  },
  findOne: function( req, res ) {
    console.log(req.param('id'));
    return Game.findOne({ id: req.param('game_id') })
    .then(function(game) {
      //return Round.find({ game: game.id }).then(function(rounds) {
        //games.rounds = rounds;
        //return res.json(game);
      //});
    }).catch(function(err) {
      return res.json(err, 400);
    });
  },
  find: function( req, res ) {
    let archived = req.param('archived') || false;
    return Game.find({ archived: archived })
    .exec(function (err, games) {
      if (err) {
        return res.json(err, 400);
      } else {
        games.rounds = [];
        return res.json(games);
      }
    });
  },
  add: function( req, res ) {
    return Game.find({ id: req.param('game_id') })
    .exec(function (err, games) {
      if (err) {
        return res.json(err, 400);
      } else {
        let game = games[0];
        let user = {
          id: req.param('user_id')
        };
        game.users.add(user);
        return game.save(function() {
          res.json(game);
        });
      }
    });
  },
  remove: function( req, res ) {
    return Game.find({ id: req.param('game_id') })
    .exec(function (err, games) {
      if (err) {
        return res.json(err, 400);
      } else {
        let game = games[0];
        game.users.remove(req.param('user_id'));
        return game.save(function() {
          res.json(game);
        });
      }
    });

  },
  rounds: function( req, res ) {
    return Game.find({ id: req.param('game_id') })
    .exec(function (err, games) {
      if (err) {
        return res.json(err, 400);
      } else {
        let game = games[0];
        return Round.find({ game: games[0].id })
        .exec(function (err, rounds) {
          if (err) {
            return res.json(err, 400);
          } else {
            res.json(rounds);
          }
        });
      }
    });
  },
  newRound: function( req, res ) {
    return Game.find({ id: req.param('game_id') })
    .exec(function (err, games) {
      if (err) {
        return res.json(err, 400);
      } else {
        let game = games[0];
        return Round.create({ game: game })
        .exec(function(err, round) {
          if (err) {
            return res.json(err, 400);
          } else {
            game.rounds.add(round);
            return game.save(function() {
              res.json(game);
            });
          }
        });
      }
    });
  }
	
};

