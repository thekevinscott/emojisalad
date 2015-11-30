'use strict';
const squel = require('squel');
const db = require('db');
const Promise = require('bluebird');
const Phone = require('./phone');
const Player = require('./player');
const User = require('./user');

let Invite = {
  create: Promise.coroutine(function* (inviter, value) {
    let numbers = yield Phone.parse([value]);
    let number = numbers[0];

    // does a user already exist for this number?
    let user = yield User.get({ from: number });
    if ( user && user.blacklist ) {
      throw new Error(3);
    } else if ( ! user ) {
      user = yield User.create({ from: number });
    }

    let invite = yield this.get(inviter, number);
    if ( invite ) {
      throw new Error(2);
    }

    let invited_player = yield Player.create({ from: number, user: user });

    let query = squel
                .insert()
                .into('invites')
                .set('invited_player_id', invited_player.id)
                .set('inviter_player_id', inviter.id);
    
    let rows = yield db.query(query);

    if ( rows && rows.insertId ) {
      return {
        id: rows.insertId,
        invited_player: invited_player,
        inviting_player: inviter
      };
    } else {
      console.error(query.toString());
      throw "There was an error inserting invite";
    }
  }),
  getInviter: Promise.coroutine(function* (player) {
    let query = squel
                .select()
                .field('inviter_player_id')
                .from('invites')
                .where('invited_player_id=?', player.id);
    let rows = yield db.query(query.toString());
    if ( rows && rows.length ) {
      return yield Player.get({ id: rows[0].inviter_player_id });
    } else {
      return null;
    }
  }),
  get: Promise.coroutine(function* (inviter, number) {
    //let invite = yield this.get(inviter, number);
    let query = squel
                .select()
                .from('invites','i')
                .left_join('players', 'p', 'p.id=i.invited_player_id')
                .left_join('users', 'u', 'u.id=p.user_id')
                .where('u.from=?', number)
                .where('inviter_player_id=?',inviter.id);

    let invites = yield db.query(query.toString());
    if ( invites.length ) {
      return invites[0];
    } else {
      return null;
    }
  }),
};

module.exports = Invite;
