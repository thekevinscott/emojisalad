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
    const to = req.param('to');
    //const user_id = req.param('user_id');
    const from = req.param('from');

    if ( ! to ) {
      return res.status(400).json({ error: `Invalid to number provided` });
    } else if ( ! from ) {
      return res.status(400).json({ error: `Invalid from number provided` });
    }

    return Player.createPlayer({
      to: to,
      from: from,
      state: req.param('state')
    }).then((player) => {
      if ( player && ! player.error ) {
        res.json(player);
      } else {
        res.status(400).json(player);
      }
    }).catch((err) => {
      res.status(400).json({ error: err });
    });

  },
  update: (req, res) => {
    const includes = [
      { model: GameNumber, as: 'game_number' },
      { model: User, as: 'user' },
      { model: State, as: 'state' }
    ];
    const player_id = req.param('player_id');
    return State.findOne({ where: { state: req.param('state') }}).then((state) => {
      return Player.update({ state_id: state.id }, { where: { id: player_id } });
    }).then(() => {
      return Player.findOne({ where: { id: player_id }, include: includes});
    }).then((player) => {
      return res.json({
        id: player.id,
        state: player.state.state,
        archived: player.archived,
        user_id: player.user.id,
        to: player.game_number.number,
        from: player.user.from,
        avatar: player.user.avatar,
        nickname: player.user.nickname,
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

    const params = {
      to: to,
      from: from
    };
    return Player.get(params).then((player) => {
      if ( player && ! player.error ) {
        res.json(player);
      } else {
        res.status(400).json(player);
      }
    }).catch(function(err) {
      return res.status(400).json(err);
    });
  }
};

