'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
//const _ = require('lodash');
const Phone = require('./phone');
const Game = require('./game');
const Player = require('./player');

let Invite = {
  create: function(type, value, inviting_player, game_number) {
    if ( type === 'twilio' ) {
      return Phone.parse(value).then(function(number) {
        // first check to see if player exists
        return Player.get({ number: number }).then(function(player) {
          if ( player ) {
            if ( player.blacklist ) {
              throw new Error(3);
            } else {
              return Promise.join(
                Player.getGames(player),
                Invite.getInvites(player),
                function(games, invites) {
                  // check if the player is part of the current game
                  let game_exists = games.filter(function(game) {
                    return game.game_number === game_number;
                  }).length;

                  let invites_exist = invites.filter(function(invite) {
                    console.debug(game_number, invite.invited_game_number);
                    return invite.inviter_game_number === game_number;
                  }).length;

                  if ( games.length >= player.maximum_games ) {
                    throw new Error(12);
                  } else if ( invites_exist ) {
                    throw new Error(2);
                  } else if ( game_exists ) {
                    throw new Error(2);
                  } else {
                    player.games = games;
                    player.invites = invites;
                    return player;
                  }
                }
              );
            }
          } else {
            return Player.create({ number: number },
                               'text_invite', type);
          }
        });
      }).then(function(invited_player) {
        let existing_game_numbers = squel
                                    .select()
                                    .field('game_number_id')
                                    .from('game_participants')
                                    .where('player_id=?',invited_player.id);

        let get_inviter_game_number = squel
                                      .select()
                                      .field('id')
                                      .field('number')
                                      .from('game_numbers')
                                      .where('number=?',game_number);

        let get_invited_game_number = squel
                                      .select()
                                      .field('id')
                                      .field('number')
                                      .from('game_numbers')
                                      .where('id NOT IN (?)', existing_game_numbers)
                                      .order('id')
                                      .limit(1);
        return Promise.join(
          db.query(get_inviter_game_number),
          db.query(get_invited_game_number),
          function(inviter_game_number, invited_game_number) {
            if ( ! inviter_game_number.length ) {
              console.error(get_inviter_game_number.toString());
              throw "No inviter game number found";
            }
            if ( ! invited_game_number.length ) {
              console.error(get_invited_game_number.toString());
              throw "No invited game number found";
            }
            let query = squel
                        .insert()
                        .into('invites')
                        .set('game_id', inviting_player.game.id)
                        .set('invited_player_id', invited_player.id)
                        .set('inviter_player_id', inviting_player.id)
                        .set('invited_game_number_id', invited_game_number[0].id)
                        .set('inviter_game_number_id', inviter_game_number[0].id);
          
            let invite_id;
            return db.query(query.toString()).then(function(rows) {
              invited_player.game_number = invited_game_number[0].number;
              inviting_player.game_number = inviter_game_number[0].number;
              invite_id = rows.insertId;
            }).then(function() {
              return Game.get({ player: { id: inviting_player.id, game_number: game_number }}).then(function(game) {
                return game;
                //console.log('invited player', invited_player);
                //invited_player.initial_state = (invited_player.games && invited_player.games.length) ? 'invited-to-new-game' : 'waiting-for-confirmation';
                //return Game.add(
                  //game,
                  //[invited_player]);
              });
            }).then(function() {
              return {
                id: invite_id,
                invited_player: invited_player,
                inviting_player: inviting_player
              };
            });
          }
        );
      });
    }
  },
  get: function(player) {
    let query = squel
                .select()
                .field('i.id')
                .field('game_id')
                .field('used')
                .field('inviters.id','inviter_player_id')
                .field('inviteds.id','invited_player_id')
                .field('inviter_number.number','inviter_game_number')
                .field('invited_number.number','invited_game_number')
                .from('invites','i')
                .left_join('game_numbers','inviter_number','i.inviter_game_number_id=inviter_number.id')
                .left_join('game_numbers','invited_number','i.invited_game_number_id=invited_number.id')
                .left_join('players','inviters','inviters.id=i.inviter_player_id')
                .left_join('players','inviteds','inviteds.id=i.invited_player_id')
                .where('used=0')
                .where('inviteds.id=?', player.id)
                .where('invited_number.number=?', player.game_number);
    return db.query(query.toString());
  },
  use: function(invite) {
    let query = squel
                .update()
                .table('invites')
                .set('used=1')
                .where('id=?',invite.id);

    return db.query(query.toString()).then(function() {
      invite.used = 1;
      return invite;
    });
  },
  getInvites: function(player) {
    let query = squel
                .select()
                .field('i.id')
                .field('game_id')
                .field('used')
                .field('inviters.id','inviter_player_id')
                .field('inviteds.id','invited_player_id')
                .field('inviter_number.number','inviter_game_number')
                .field('invited_number.number','invited_game_number')
                .from('invites','i')
                .left_join('game_numbers','inviter_number','i.inviter_game_number_id=inviter_number.id')
                .left_join('game_numbers','invited_number','i.invited_game_number_id=invited_number.id')
                .left_join('players','inviters','inviters.id=i.inviter_player_id')
                .left_join('players','inviteds','inviteds.id=i.invited_player_id')
                .where(
                  squel.expr()
                  .and('inviters.id=?', player.id)
                  .or('inviteds.id=?', player.id)
                );
    return db.query(query.toString());
  }
};

module.exports = Invite;
