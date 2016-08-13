'use strict';
const squel = require('squel');
const db = require('db');
const Promise = require('bluebird');
const Player = require('./player');
const User = require('./user');
const Game = require('./game');
const _ = require('lodash');
const registry = require('microservice-registry');
const request = Promise.promisify(require('request'));
import setKey from 'setKey';

const Invite = {
  /**
   * Create will return an array of invites corresponding
   * to the invites passed in.
   *
   * The return signature will have an id for the invite,
   * a game, the inviter PLAYER object, and the invited USER object
   */
  create: (params) => {
    console.info('invite create 1', params);
    return Player.findOne(params.inviter_id).then((player) => {
      console.info('the player found, who is the inviter', player);
      if ( player && player.id ) {
        return player;
      } else {
        throw new Error("You must provide a valid inviter_id");
      }
    }).then((inviter_player) => {
      console.info('the invitee string', params.invitee);
      return User.findOne(params.invitee).then((user) => {
        if ( user && user.id ) {
          console.info('user exists and is', user);
          return user;
        } else {
          console.info('user does not exist, create it');
          return User.create(params.invitee);
        }
      }).then((invited_user) => {
        console.info('the invited user', invited_user);
        return Game.findOne({ player_id: params.inviter_id }).then((game) => {
          const players = game.players.map((player) => {
            return player.from;
          });
          if ( invited_user.blacklist ) {
            return {
              error: `User has asked not to be contacted`,
              code: 1202
            };
          } else if ( invited_user.id === inviter_player.user_id ) {
            return {
              error: `You can't invite yourself`,
              code: 1203
            };
          } else if ( players.indexOf(invited_user.from) !== -1 ) {
            return {
              error: `User is already in game`,
              code: 1205
            };
          } else {
            console.info('find an invite');
            return Invite.findOne({ used: 0, game_id: game.id, invited: invited_user.id }).then((invite) => {
              console.info('whats the result');
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
                console.info('we made it');
                const player_sender_ids = invited_user.players.map((player) => {
                  return player.to;
                });

                const service = registry.get(invited_user.protocol);
                if (!service) {
                  throw new Error(`No service provided for protocol ${invited_user.protocol}`);
                }
                console.info('service', invited_user.protocol, JSON.stringify(service.api));
                const options = {
                  url: service.api.senders.get.endpoint,
                  method: service.api.senders.get.method,
                  qs: {
                    exclude: player_sender_ids.join(',')
                  }
                };

                console.info('service options', options);

                return request(options).then((response) => {
                  try {
                    return JSON.parse(response.body);
                  } catch (err) {
                    console.error('error parsing json response', response.body);
                    throw new Error(`Error getting sender, for protocol: ${invited_user.protocol}`);
                  }
                }).then((response) => {
                  console.info('request response', response);
                  if ( response && response.id ) {
                    //const game_number = rows[0];

                    const query = squel
                    .insert()
                    .into('invites')
                    .set('game_id', game.id)
                    .set('game_number_id', response.id)
                    .set('invited_id', invited_user.id)
                    .set('inviter_id', params.inviter_id);

                    return db.query(query.toString()).then((row) => {
                      invited_user.to = response.id;

                      const finalInvite = {
                        id: row.insertId,
                        game,
                        invited_user,
                        inviter_player
                      };
                      return setKey('invites', {
                        ...finalInvite,
                      }).then(() => {
                        return finalInvite;
                      });
                    });
                  } else {
                    console.error('No game numbers returned for', invited_user);
                    throw new Error('No game numbers returned, major error');
                  }
                });
              }
            });
          }
          //}));
        });
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
                .field('i.game_number_id', 'sender')
                //.field('n.number', 'game_number')
                .field('i.*')
                .from('invites', 'i')
                //.left_join('game_numbers', 'n', 'n.id=i.game_number_id')
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

    if ( params.invited_id ) {
      query = query.where('i.invited_id = ?',params.invited_id);
    } else if ( params.invited ) {
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

    console.info('params', params);
    console.info('invite query', query.toString());
    return db.query(query).then((invites) => {
      console.info('got invite back');
      if ( invites && invites.length ) {
        //console.info('invites found');
        return Promise.join(
          Game.find({ player_ids: invites.map(invite => invite.inviter_id) }),
          Player.find({ ids: invites.map(invite => invite.inviter_id) }),
          User.find({ ids: invites.map(invite => invite.invited_id) }),
          (games_arr, inviters, inviteds) => {
            //console.info('did game find, player find, and user find');
            const games = _.indexBy(games_arr, 'id');
            const players = _.indexBy(inviters, 'id');
            const users = _.indexBy(inviteds, 'id');

            return invites.map((invite) => {
              return {
                id: invite.id,
                game: games[invite.game_id],
                //invited_user: _.assign({ to: invite.game_number }, users[invite.invited_id]),
                invited_user: _.assign({ to: invite.sender }, users[invite.invited_id]),
                inviter_player: players[invite.inviter_id],
                used: invite.used
              };
            });
          }
        );
      } else {
        //console.info('no invites found');
        return [];
      }
    });
  },
  use: (invite_id) => {
    console.info('USE THIS INVITE', invite_id);
    const query = squel
                  .update()
                  .table('invites')
                  .set('used=1')
                  .where('id=?',invite_id);

    return db.query(query.toString()).then(() => {
      return Invite.findOne(invite_id);
    });
  }
};

module.exports = Invite;
