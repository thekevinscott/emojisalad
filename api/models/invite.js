'use strict';
const squel = require('squel');
const db = require('db');
const Phone = require('./phone');
const Player = require('./player');

let Invite = {
  create: function(type, value, invitingPlayer) {
    if ( type === 'twilio' ) {
      return Phone.parse([value]).then(function(numbers) {
        let number = numbers[0];
        // first check to see if player exists
        return Player.get({ number: number }).then(function(player) {

          if ( player && player.blacklist ) {
            throw new Error(3);
          } else if ( player ) {
            throw new Error(2);
          } else {
            return Player.create({ number: number },
                               'text_invite', type);
          }
        });
      }).then(function(invited_player) {
        let query = squel
                    .insert()
                    .into('invites')
                    .set('invited_player_id', invited_player.id)
                    .set('inviter_player_id', invitingPlayer.id);
      
        return db.query(query).then(function(rows) {
          return {
            id: rows.insertId,
            invited_player: invited_player,
            inviting_player: invitingPlayer
          };
        });
      });
    }
  },
};

module.exports = Invite;
