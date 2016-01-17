/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
const Promise = require('bluebird');

module.exports = {
  create: function(req, res) {
    let state = 'waiting-for-confirmation';
    const to = req.param('to');
    const user_id = req.param('user_id');
    if ( req.param('state') ) {
      state = req.param('state');
    }

    if ( ! to ) {
      return res.status(400).json({ error: `Invalid number provided` });
    } else if ( ! user_id ) {
      return res.status(400).json({ error: `Invalid user id provided` });
    }

    const promises = [{
      model: State,
      where_clause: { state: state }
    }, {
      model: GameNumber,
      where_clause: { number: to }
    }, {
      model: User,
      where_clause: { id: user_id }
    }].map(function(association) {
      return association.model.findOne({ where: association.where_clause}).then(function(result) {
        if ( result ) {
          return result;
        }
      });
    });

    return Promise.all(promises).then(function(results) {
      let state_id = results[0];
      let game_number_id = results[1];
      let user = results[2];

      if ( ! state_id ) {
        return res.status(400).json({ error: `Invalid state provided: ${state}` });
      } else if ( ! game_number_id ) {
        return res.status(400).json({ error: `Invalid number provided: ${to}` });
      } else if ( ! user ) {
        return res.status(400).json({ error: `Invalid user id provided: ${user_id}` });
      }

      return Player.create({
        game_number_id: game_number_id.id,
        state_id: state_id.id,
        user_id: user_id
      }).then(function(results) {
        let player = results.dataValues;

        player.state = state;
        player.to = to;
        return res.json({
          to: to,
          state: state,
          id: player.id,
          from: user.from,
          avatar: user.avatar,
          user_id: user.id

        });
      });
    }).catch(function(err) {
      return res.status(400).json(err);
    });
    /*
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
    */
  },

  find: function( req, res ) {
    const to = req.param('to');
    const from = req.param('from');

    if ( ! to ) {
      return res.status(400).json({ error: `Invalid number provided` });
    } else if ( ! from ) {
      return res.status(400).json({ error: `Invalid number provided` });
    }

    console.log(to, from);
    function getUser(from) {
      return User.findOne({ where: { from: from } }).then(function(result) {
        return result.dataValues;
      });
    }

    function getGameNumber(to) {
      return GameNumber.findOne({ where: { number: to } }).then(function(result) {
        return result.dataValues;
      });
    }

    return Promise.join(getUser(from), getGameNumber(to), function(user, game_number) {
      const where = {
        user_id: user.id,
        game_number_id: game_number.id,
        archived: req.param('archived') || null 
      };
      return Player.findOne({ where: where, include: [State] }).then(function(result) {
        const player = result.dataValues;
        return res.json({
          id: player.id,
          state: player.State.dataValues.state,
          archived: player.archived,
          user_id: user.id,
          to: to,
          from: from,
          avatar: user.avatar,
          nickname: user.nickname,
        });
      });
    }).catch(function(err) {
      return res.status(400).json(err);
    });
  }
};

