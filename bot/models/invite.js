'use strict';
const squel = require('squel');
const db = require('db');
const Promise = require('bluebird');
const Phone = require('./phone');
const Player = require('./player');
const User = require('./user');

const api = require('../service')('api');

const Invite = {
  create: (inviter, invites) => {
    //console.debug('create time!');
    return api('invites', 'create', {
      inviter_id: inviter.id,
      invites: invites
    }, {
      game_id: inviter.game_id
    }); 
  },
  get: (params = {}) => {
    return api('invites', 'get', params);
  },
  getInvite: Promise.coroutine(function* (inviter) {
    let query = squel
                .select()
                .from('invites', 'i')
                .where('i.invited_player_id=?', inviter.id);
    //console.debug(query.toString());
    let rows = yield db.query(query.toString());
    if ( rows && rows.length ) {
      return rows[0];
    } else {
      return null;
    }
  }),
  getInviter: Promise.coroutine(function* (inviter) {
    let query = squel
                .select()
                .field('i.inviter_player_id')
                .from('invites', 'i')
                .where('i.invited_player_id=?', inviter.id);
    let rows = yield db.query(query.toString());
    if ( rows && rows.length ) {
      return yield Player.get({ id: rows[0].inviter_player_id });
    } else {
      return null;
    }
  }),
  use: Promise.coroutine(function* (invite) {
    let query = squel
                .update()
                .table('invites')
                .set('used=1')
                .where('id=?',invite.id);

    yield db.query(query.toString());
    invite.used = 1;
    return invite;
  }),
};

module.exports = Invite;
