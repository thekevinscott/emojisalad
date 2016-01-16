/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

module.exports = {
  create: function(req, res) {
    let state = 'waiting-for-confirmation';
    if ( req.param('state') ) {
      console.log('req', req.param('state'));
      state = req.param('state');
    }

    return Player.create({
      state_id: Sequelize.literal(`(SELECT id FROM states WHERE state = ${sequelize.escape(state)})`),
      user_id: req.param('user_id'),
      //state_id: Sequelize.literal(`(SELECT id FROM states WHERE state = "${sequelize.escape(state)}")`),
      //state_id: Sequelize.literal(`(SELECT id FROM states WHERE state = "${sequelize.escape(state)}")`)
    }).then(function(player) {
      console.log('2');
      return res.json(player);
    }).catch(function(err) {
      console.error(err);
      return res.status(400).json(err);
    });

    return GameNumber.findOne({ number: req.param('to') }).then(function(game_number) {
      console.log(game_number);
      if ( req.param('state') ) {
        state = req.param('state');
      }
      return State.findOne({ state: state }).then(function(result) {
        const params = {
          to: game_number.id,
          user: req.param('user_id'),
          state: result.id 
        };
        console.log(params);

        return Player.create(params);
      }).then(function(player) {
        return User.findOne({ id: player.user }).then(function(user) {
          player.from = user.from;
          player.avatar = user.avatar;
          player.nickname = user.nickname;
          player.blacklist = user.blacklist;
          player.user_id = user.id;
          return res.json(player);
        });
      });
    }).catch(function(err) {
      return res.status(400).json(err);
    });
  },

  find: function( req, res ) {
    const archived = req.param('archived') || false;
    const whitelisted = ['id', 'to'];

    let params = { archived: archived };
    whitelisted.map((key) => {
      if ( req.param(key) ) {
        params[key] = req.param(key);
      }
    });
    return Player.findAll().then(function(players) {
    //return User.find({ from: req.param('from') }).populate('player', params).then(function(user) {
      //return Player.find(params);
    //}).then(function(players) {
      return res.json(players);
    }).catch(function(err) {
      return res.status(400).json(err);
    });
  },
	
};

