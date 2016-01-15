/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
const _ = require('lodash');

module.exports = {
  create: function( req, res ) {
    const params = { from: req.param('from') };

    return Emoji.find().limit(1).exec(function (err, result) {
      if (err) { return res.json(err, 400); }
      const params = {
        from: req.param('from'),
        avatar: result[0].emoji
      };
      return User.create(params).exec(function (err, user ) {
        if (err) { return res.json(err, 400); }
        return res.json(user);
      });
    });
  },
  destroy: function( req, res ){
    return User.update({ id: req.param('id') }, { archived: true })
    .exec(function (err, user) {
      if (err) { return res.json(err, 400); }
      return res.json(user[0]);
    });
  },
  find: function( req, res ) {
    const archived = req.param('archived') || false;
    const whitelisted = ['id', 'from', 'player_id'];
    let params = { archived: archived };
    whitelisted.map((key) => {
      if ( req.param(key) ) {
        params[key] = req.param(key);
      }
    });
    return User.find(params)
    .exec(function (err, users) {
      if (err) { return res.json(err, 400); }
      return res.json(users);
    });
  },
  games: function( req, res ) {
    return User.find({ id: req.param('user_id') })
    .exec(function (err, users) {
      if (err) {
        return res.json(err, 400);
      } else {
        return Game.find({ })
        .exec(function (err, users) {
          if (err) return res.json(err, 400);
          return res.json(users);
        });
      }
    });
  }
};
