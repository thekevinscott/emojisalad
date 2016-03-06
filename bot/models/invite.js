'use strict';
//const squel = require('squel');
//const db = require('db');
//const Promise = require('bluebird');
//const Phone = require('./phone');
//const Player = require('./player');
//const User = require('./user');

const api = require('../service')('api');

const Invite = {
  create: (inviter, invites) => {
    console.info('invite create payload', {
      inviter_id: inviter.id,
      invites
    }, {
      game_id: inviter.game_id
    });
    //console.debug('create time!');
    return api('invites', 'create', {
      inviter_id: inviter.id,
      invites
    }, {
      game_id: inviter.game_id
    });
  },
  get: (params = {}) => {
    return api('invites', 'get', params);
  },
  use: (invite) => {
    return api('invites', 'use', {}, {
      game_id: invite.game_id,
      invite_id: invite.id
    });
  }
};

module.exports = Invite;
