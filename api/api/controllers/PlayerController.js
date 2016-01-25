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
    //const user_id = req.param('user_id');
    const from = req.param('from');
    if ( req.param('state') ) {
      state = req.param('state');
    }

    if ( ! to ) {
      return res.status(400).json({ error: `Invalid to number provided` });
    } else if ( ! from ) {
      return res.status(400).json({ error: `Invalid from number provided` });
    }

    const promises = [{
      model: State,
      where_clause: { state: state }
    }, {
      model: GameNumber,
      where_clause: { number: to }
    }, {
      model: User,
      where_clause: { from: from }
    }].map(function(association) {
      return association.model.findOne({ where: association.where_clause}).then(function(result) {
        if ( result ) {
          return result;
        }
      });
    });

    return Promise.all(promises).then(function(results) {
      let state_result = results[0];
      let game_number = results[1];
      let user = results[2];

      if ( ! state_result ) {
        return res.status(400).json({ error: `Invalid state provided: ${state}` });
      } else if ( ! game_number ) {
        return res.status(400).json({ error: `Invalid to number provided: ${to}` });
      } else if ( ! user ) {
        return res.status(400).json({ error: `Invalid from number provided: ${from}` });
      }

      return Player.create({
        game_number_id: game_number.get('id'),
        state_id: state_result.get('id'),
        user_id: user.get('id')
      }).then(function(player) {
        //let player = results.dataValues;

        //player.state = state;
        //player.to = to;
        return res.json({
          to: to,
          state: state_result.get('state'),
          id: player.get('id'),
          from: user.get('from'),
          avatar: user.get('avatar'),
          user_id: user.get('id')
        });
      });
    }).catch(function(err) {
      console.log('here we go!');
      //return res.status(200).json(err);
      return res.json(err);
    });
    /*
    let state = 'waiting-for-confirmation';
    if ( req.param('state') ) {
      console.log('req', req.param('state'));
      state = req.param('state');
    }

    });
    */
  },
  update: (req, res) => {
    const player_id = req.param('player_id');
    return State.findOne({ where: { state: req.param('state') }}).then((state) => {
      return Player.update({ state_id: state.get('id') }, { where: { id: player_id } });
    }).then(() => {
      return Player.findOne({ where: { id: player_id }, include: [ GameNumber, User, State ]});
    }).then((player) => {
      return res.json({
        id: player.id,
        state: player.State.state,
        archived: player.archived,
        user_id: player.User.id,
        to: player.GameNumber.number,
        from: player.User.from,
        avatar: player.User.avatar,
        nickname: player.User.nickname,
      });
    }).catch((err) => {
      console.error(err);
      return res.status(400).json({ error: `Unknown error` });
    });
  },
  find: (req, res) => {
    const to = req.param('to');
    const from = req.param('from');

    if ( ! to ) {
      return res.status(400).json({ error: `Invalid number provided` });
    } else if ( ! from ) {
      return res.status(400).json({ error: `Invalid number provided` });
    }

    function getUser(from) {
      console.log('from', from);
      return User.findOne({ where: { from: from } });
    }

    function getGameNumber(to) {
      return GameNumber.findOne({ where: { number: to } });
    }

    return Promise.join(getUser(from), getGameNumber(to), function(user, game_number) {
      if ( ! user ) {
        console.log('aint no user');
        return res.json({ error: `No user found` });
      }
      if ( ! game_number ) {
        return res.status(400).json({ error: `No game number found` });
      }

      const where = {
        user_id: user.get('id'),
        game_number_id: game_number.get('id'),
        archived: req.param('archived') || null 
      };
      return Player.findOne({ where: where, include: [State, GameNumber, User] }).then(function(player) {
        return res.json({
          id: player.get('id'),
          state: player.State.dataValues.state,
          archived: player.get('archived'),
          user_id: user.id,
          to: to,
          from: from,
          avatar: user.avatar,
          nickname: user.nickname,
        });
      });
    }).catch(function(err) {
      console.error(err);
      return res.status(400).json(err);
    });
  }
};

