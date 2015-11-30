'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const User = require('models/user');
const _ = require('lodash');
let Game;

let Player = {
  // create a new player
  create: function(params) {
    let number;
    if ( params.to ) {
      number = squel
               .select()
               .field('id')
               .from('game_numbers','n')
               .where('n.number=?', params.to);
    } else {
      // no game number has been specified;
      // for instance, if an invite has
      // been created.
      //
      // In this case, we auto generate a game
      // number for this player
      number = squel
               .select()
               .field('id')
               .from('game_numbers','n')
               .order('id')
               .limit(1);
    }

    let query = squel
                .insert({ autoQuoteFieldNames: true })
                .into('players')
                .setFields({
                  to: number,
                  created: squel.fval('NOW(3)'),
                  user_id: params.user.id
                });

    query.setFields({ 'state_id': squel
                                 .select()
                                 .field('id')
                                 .from('player_states')
                                 .where('state=?','waiting-for-confirmation')});

    return db.query(query.toString()).then(function(rows) {
      let player = _.assign({
        id: rows.insertId,
        // convenience, so number is
        // an alias for 'from'
        number: params.user.from,
        from: params.user.from
      }, params);

      return player;
    });
  },

  get: function(params) {
    //console.log('params', params);
    if ( !params.id && ( (!params.from && !params.number) || !params.to )) {
      throw new Error({
        message: 'Tried to select on an invalid params key'
      });
    } 

    let user_params = {};
    if ( params.from ) {
      user_params.from = params.from;
    } else if ( params.number ) {
      user_params.from = params.number;
    } else if ( params.id ) {
      user_params.player_id = params.id;
    }

    //console.log('params', params);
    //console.log('user_params', user_params);
    return User.get(user_params).then(function(user) {
      if ( ! user ) {
        return null;
      } else {

        let query = squel
                    .select({ autoEscapeFieldNames: true })
                    .field('p.id')
                    .field('p.created')
                    .field('p.blacklist')
                    .field('p.state_id')
                    .field('p.to')
                    //.field('i.inviter_params_id')
                    .field('s.state', 'state')
                    .field('u.id', 'user_id')
                    .field('u.blacklist')
                    .field('u.nickname')
                    .from('players', 'p')
                    //.left_join('invites', 'i', 'p.id = i.invited_params_id')
                    .left_join('player_states', 's', 's.id = p.state_id')
                    .left_join('users', 'u', 'u.id = p.user_id')
                    .where('u.id=?', user.id);

        if ( params.id ) {
          query = query.where('p.`id`=?', params.id);
        //} else if ( params.invited_params_id ) {
          //query = query.where('i.invited_params_id=?', params.invited_params_id);
        } else if ( params.to ) {
          query = query
                  .left_join('game_numbers','n','n.id=p.`to`')
                  .where('n.number=?',params.to);
        }

        //console.log(query.toString());
        return db.query(query.toString()).then(function(players) {
          if ( ! players.length ) {
            return null;
          } else {

            let player = players[0];

            player.number = user.from;
            player.from = user.from;
            player.user_id = user.id;
            player.user = user;

            return player;
          }
        });
      }
    });
  },

  update: Promise.coroutine(function* (player, params) {

    let query = squel
                .update()
                .table('players', 'p')
                .where('p.id=?', player.id);

    if ( params.state ) {
        let state = squel
                     .select()
                     .field('id')
                     .from('player_states')
                     .where('state=?', params.state);

        query.set('state_id', state, { dontQuote: true });
    }

    yield db.query(query.toString());
    return player;
  }),
  logLastActivity: function(player, game_number) {
    if ( ! Game ) {
      Game = require('./game');
    }
    const promises = [];
    if ( player && player.id ) {
      let update_player = squel
                        .update()
                        .table('players')
                        .setFields({
                          last_activity: squel.fval('NOW(3)')
                        })
                       .where('id=?',player.id);

      promises.push(db.query(update_player));

      promises.push(Game.get({ player: player, game_number: game_number }).then(function(game) {
        if ( game && game.id ) {

          let update_game = squel
                            .update()
                            .table('games')
                            .setFields({
                              last_activity: squel.fval('NOW(3)')
                            })
                           .where('id=?',game.id);

          return db.query(update_game);
        }
      }));
    }

    return Promise.all(promises);
  }
};

module.exports = Player;
