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

    return Invite.createInvite({
      inviter_id: inviter_id,
      invited: invited
    }).then((invite) => {
      if ( invite && !invite.error ) {
        res.json(invite);
      } else {
        return res.status(400).json(invite);
      }
    }).catch(function(err) {
      console.error(err);
      return res.status(400).json(err);
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
    ['inviter_id', 'invited_id', 'used', 'id'].map((key) => {
      if ( options[key] ) {
        params[key] = options[key];
      }
    });
    return Invite.get(params).then((invite) => {
      if ( invite && !invite.error ) {
        res.json(invite);
      } else {
        return res.status(400).json(invite);
      }
    }).catch(function(err) {
      //console.error(err);
      return res.status(400).json(err);
    });
  },
};
