/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
const _ = require('lodash');

module.exports = {
  create: function(req, res) {
    const params = { from: req.param('from') };

    return User.create(params).then(function(user) {
      return res.json(user);
    }).catch(function(err) {
      return res.status(400).json(err);
    });
  },
  destroy: function(req, res){
    return User.update({ id: req.param('id') }, { archived: true }).then(function(user) {
      return res.json(user[0]);
    }).catch(function(err) {
      return res.status(400).json(err);
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
    return User.findAll(params).then(function(users) {
      return res.json(users);
    }).catch(function(err) {
      console.error(err);
      return res.status(400).json(err);
    });
  },
};
