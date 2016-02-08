'use strict';
const squel = require('squel');
const db = require('db');
const Promise = require('bluebird');
const Phone = require('./phone');
const Player = require('./player');
const User = require('./user');
const Game = require('./game');
const _ = require('lodash');

const Invite = {
  /**
   * Create will return an array of invites corresponding
   * to the invites passed in.
   *
   * The return signature will have an id for the invite,
   * a game, the inviter PLAYER object, and the invited USER object
   */
  create: (params) => {
    console.debug('invite create 1', params);
    return Player.findOne(params.inviter_id).then((player) => {
      console.debug('create 2', player);
      if ( player && player.id ) {
        return player;
      } else {
        throw "You must provide a valid inviter_id";
      }
    }).then((inviter_player) => {
      console.debug('create 3', params.invites);
      return Promise.all(params.invites.map((invite) => {
        return User.findOne({ from: invite }).then((user) => {
          if ( user && user.id ) {
            return user;
          } else {
            return User.create({ from: invite });
          }
        });
      })).then((invited_users) => {

        //return User.getPlayersNum(user);
      //}).then((players) => {
        //if ( players >= user.maximum_games) {
          //throw new Error(12);
        //}

        return Game.findOne({ player_id: params.inviter_id }).then((game) => {
          return Promise.all(invited_users.map((invited_user) => {
            if ( invited_user.blacklist ) {
              return {
                error: `User has asked not to be contacted`,
                code: 1202
              };
            } else if ( invited_user.id === inviter_player.user_id ) {
              // loose equality, because one could be a string or an integer
              return {
                error: `You can't invite yourself`,
                code: 1203
              };
            } else {
              return Invite.findOne({ used: 0, game_id: game.id, invited: invited_user.id }).then((invite) => {
                if ( invite && invite.id ) {
                  return {
                    error: `Invite already exists for ${invited_user.from}`,
                    code: 1200
                  };
                } else if ( invited_user.number_of_players >= invited_user.maximum_games ) {
                  return {
                    error: `User is playing the maximum number of games`,
                    code: 1204
                  };
                } else if ( game.players.filter(player => player.user_id === invited_user.id).length ) {
                  return {
                    error: `User ${invited_user.from} already playing game`,
                    code: 1203
                  };
                } else {
                  console.debug('invite create 9');
                  let query = squel
                              .insert()
                              .into('invites')
                              .set('game_id', game.id)
                              .set('invited_id', invited_user.id)
                              .set('inviter_id', params.inviter_id);

                  console.debug(query.toString());
                  return db.query(query).then((row) => {
                    invited_user.to = inviter_player.to;

                    return {
                      id: row.insertId,
                      game: game,
                      invited_user: invited_user,
                      inviter_player: inviter_player
                    }
                  });
                }
              });
            }
          }));
        });
      }).then((rows) => {
        if ( rows && rows.length ) {
          return rows;
        } else {
          throw "There was an error inserting invite";
        }
      });
    }).catch((err) => {
      console.error(err);
      throw err;
    });
  },
  findOne: (params = {}) => {
    if (parseInt(params)) {
      params = { id: params };
    }
    return Invite.find(params).then((invites) => {
      if ( invites && invites.length) {
        return invites[0];
      } else {
        return {};
      }
    });
  },
  find: (params = {}) => {
    let query = squel
                .select()
                .field('i.*')
                .from('invites', 'i')
                .left_join('games', 'g', 'g.id=i.game_id');

    if ( params.id ) {
      query = query.where('i.id=?',params.id);
    }

    if ( params.game_id ) {
      query = query.where('i.game_id = ?',params.game_id);
    }

    if ( params.inviter_id ) {
      query = query.where('i.inviter_id = ?',params.inviter_id);
    }

    if ( params.invited ) {
      query = query.where('i.invited_id = ?',params.invited);
    }

    if ( params.invited_from ) {
      query = query
              .left_join('users', 'u', 'u.id=i.invited_id')
              .where('u.from=?', params.invited_from);
    }

    if ( params.used !== undefined ) {
      query = query.where('i.used = ?',params.used);
    }

    return db.query(query).then((invites) => {
      if ( invites && invites.length ) {
        //console.log('invite', invites);
        return Promise.join(
          Game.find({ player_ids: invites.map(invite => invite.inviter_id) }),
          Player.find({ ids: invites.map(invite => invite.inviter_id) }),
          User.find({ ids: invites.map(invite => invite.invited_id) }),
          (games_arr, inviters, inviteds) => {
        //return Game.find({ player_ids: invites.map(invite => invite.inviter_id) }).then((games) => {
            const games = _.indexBy(games_arr, 'id');
            const players = _.indexBy(inviters, 'id');
            const users = _.indexBy(inviteds, 'id');

            return invites.map((invite) => {
              return {
                id: invite.id,
                game: games[invite.game_id],
                invited_user: users[invite.invited_id],
                inviter_player: players[invite.inviter_id],
                used: invite.used
              };
            });
          }
        );
      } else {
        return [];
      }
    });
  },
 /*
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
  */
  use: (invite_id) => {
    let query = squel
                .update()
                .table('invites')
                .set('used=1')
                .where('id=?',invite_id);

    return db.query(query.toString()).then((rows) => {
      return Invite.findOne(invite_id);
    });
  }
};

module.exports = Invite;
