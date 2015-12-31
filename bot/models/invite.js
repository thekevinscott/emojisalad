'use strict';
const squel = require('squel');
const db = require('db');
const Promise = require('bluebird');
const Phone = require('./phone');
const Player = require('./player');
const User = require('./user');

let Invite = {
  create: Promise.coroutine(function* (inviter, value) {
    console.debug('invite create 1');
    let numbers = yield Phone.parse([value]);
    let number = numbers[0];

    // does a user already exist for this number?
    let user = yield User.get({ from: number });
    let initial_state = 'invited-to-new-game';
    console.debug('invite create 2');
    if ( user && user.blacklist ) {
      console.debug('invite create 3');
      throw new Error(3);
    } else if ( ! user ) {
      console.debug('invite create 4');
      user = yield User.create({ from: number });
      initial_state = 'waiting-for-confirmation';
    }

    console.debug('invite create 5');
    // see if an invite exists
    let invite_exists = squel
                        .select()
                        .from('invites','i')
                        .left_join('players', 'p', 'p.id=i.invited_player_id')
                        .left_join('users', 'u', 'u.id=p.user_id')
                        .where('u.from=?', number)
                        .where('i.used=0')
                        .where('inviter_player_id=?',inviter.id);

    console.debug('invite create 6');
    let invites = yield db.query(invite_exists);
    if ( invites.length ) {
      throw new Error(2);
    }
    console.debug('invite create 7');

    // user already exists; 
    // are they playing less than the max
    // number of games?
    let players = yield User.getPlayersNum(user);
    if ( players >= user.maximum_games) {
      throw new Error(12);
    }

    console.debug('invite create 8');
    let invited_player = yield Player.create({ from: number, user: user, initial_state: initial_state });

    console.debug('invite create 9');
    let query = squel
                .insert()
                .into('invites')
                .set('invited_player_id', invited_player.id)
                .set('inviter_player_id', inviter.id);
    
                console.debug(query.toString());
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
  getInvite: Promise.coroutine(function* (inviter) {
    let query = squel
                .select()
                .from('invites', 'i')
                .where('i.invited_player_id=?', inviter.id);
                console.debug(query.toString());
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
