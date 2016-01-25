/**
 * InviteController
 *
 */
'use strict';
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = {
  create: (req, res) => {
    const inviter_id = req.param('inviter_id');
    const invited = req.param('invited');

    if ( ! inviter_id ) {
      return res.status(400).json({ error: `Invalid inviter`});
    }
    if ( ! invited ) {
      return res.status(400).json({ error: `Invalid invited`});
    }

    return Player.findOne({ where: { id: inviter_id } }).then((inviter_player) => {
      if ( !inviter_player ) {
        return res.status(400).json({ error: `Invalid inviter: ${inviter_id}`});
      } else {
        return inviter_player;
      }
    }).then((inviter_player) => {
      // does the invited exist yet?
      return User.findOne({ where: { from: invited }}).then((invited_player) => {
        if ( ! invited_player ) {
          return User.create({
            from: invited
          });
        } else {
          return invited_player;
        }
      }).then((invited_user) => {
        return Player.create({
          user_id: invited_user.id
        });
      }).then((invited_player) => {
        return Invite.create({
          invited_id: invited_player.id,
          inviter_id: inviter_player.id,
          used: false
        }).then((invite) => {
          res.json({
            id: invite.id,
            inviter: inviter_player,
            invited: invited_player,
            used: invite.used,
          });
        });
      });
    });
  },
  use: function(req, res){
    const invite_id = req.param('id');
    //return Player.update({ id: req.param('id') }, { archived: true }).then(function(player) {
      //return res.json(player[0]);
    //}).catch(function(err) {
      //return res.status(400).json(err);
    //});
  },
  find: (req, res) => {
    let params = {};
    if ( req.param('inviter_id') ) {
      params.inviter_id = req.param('inviter_id');
    }
    if ( req.param('invited_id') ) {
      params.invited_id = req.param('invited_id');
    }
    if ( req.param('used') ) {
      params.used = req.param('used');
    }
    const includes = [
      { model: Player, as: 'inviter' },
      { model: Player, as: 'invited' }
    ];
    //console.log('params', params);
    return Invite.findOne({ where: params , include: includes}).then((invite) => {
      //console.log('invites', invites);
      if ( invite ) {
        res.json(invite);
        //return res.json({
          //id: invite.id,
          //inviter: invite.inviter_id,
          //invited: invite.invited_id,
          //used: invite.used,
        //});
      } else {
        return res.json([]);
      }
    }).catch(function(err) {
      console.error(err);
      return res.status(400).json(err);
    });
  },
};
