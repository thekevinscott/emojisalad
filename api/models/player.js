'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const User = require('models/user');
const _ = require('lodash');
let Game;

let Player = {
  // create a new player
  create: (params) => {
    if ( ! Game ) {
      Game = require('./game');
    }
    if ( ! params.from && ! params.user_id ) {
      throw "You must provide a from or user_id field";
    }

    if ( ! params.game_id) {
      throw "You must provide a game_id field";
    }

    let user_params = {};
    if ( params.user_id ) {
      user_params = { id: params.user_id };
    } else {
      user_params = { from: params.from };
    }
    return User.findOne(user_params).then((user) => {
      if ( ! user || !user.id ) {
        throw 'You must provide a valid from or user_id field';
      } else {
        return user;
      }
    }).then((user) => {
      let number_query;
      if ( params.to ) {
        number_query = squel
                       .select()
                       .field('id')
                       .field('number')
                       .from('game_numbers','n')
                       .where('n.number=?', params.to);
      } else {
        // no game number has been specified;
        // for instance, if an invite has
        // been created.
        //
        // In this case, we auto generate a game
        // number for this player
        let get_to_query = squel
                           .select({ autoEscapeFieldNames: true })
                           .field('p.`to`')
                           //.field('`to`')
                           .from('players','p')
                           .where('p.user_id=?',user.id);

        number_query = squel
                       .select()
                       .field('id')
                       .field('number')
                       .from('game_numbers','n')
                       .where('n.id NOT IN ?', get_to_query)
                       .order('id')
                       .limit(1);
      }

      return db.query(number_query.toString()).then((numbers_rows) => {

        if ( !numbers_rows.length ) {
          console.error(number_query.toString());
          throw "No game number found";
        } else {
          return {
            to : numbers_rows[0].id,
            user_id: user.id
          };
        }
      });
    }).then((player_params) => {
      return Game.findOne(params.game_id).then((game) => {
        if ( ! game || !game.id ) {
          throw 'You must provide a valid game_id';
        } else {
          player_params.game_id = game.id;
          return player_params;
        }
      });
    }).then((player_params) => {
      let query = squel
                  .insert({ autoQuoteFieldNames: true })
                  .into('players')
                  .setFields({
                    to: player_params.to,
                    created: squel.fval('NOW(3)'),
                    user_id: player_params.user_id,
                    game_id: player_params.game_id,
                  });

      //let state;
      //if ( params.initial_state ) {
        //state = params.initial_state;
        //delete params.initial_state;
      //} else {
        //state = 'waiting-for-confirmation';
      //}

      //query.setFields({ 'state_id': squel
                                   //.select()
                                   //.field('id')
                                   //.from('player_states')
                                   //.where('state=?',state)});


      return db.create(query.toString()).then((result) => {
        return Player.findOne(result.insertId);
      });
    });
  },
  findOne: (params) => {
    if (parseInt(params)) {
      params = { id: params };
    }
    return Player.find(params).then((players) => {
      if ( players && players.length) {
        return players[0];
      } else {
        return {};
      }
    });
  },

  find: (params = {}) => {
    let archived = 0;
    if ( params.archived !== undefined ) {
      archived = params.archived;
    }

    let query = squel
                .select({ autoEscapeFieldNames: true })
                .field('p.id')
                .field('p.created')
                .field('p.archived')
                .field('n.number','to')
                //.field('p.state_id')
                .field('u.id', 'user_id')
                .field('g.id', 'game_id')
                //.field('u.blacklist')
                .field('u.nickname')
                .field('u.from')
                .field('u.blacklist')
                .field('u.avatar')
                .field('u.archived', 'user_archived')
                .from('players', 'p')
                .where('p.archived=?', archived)
                .left_join('game_numbers','n','n.id=p.`to`')
                .left_join('games','g','g.id=p.game_id')
                .left_join('users', 'u', 'u.id=p.user_id')

    if ( params.id ) {
      query = query.where('p.id=?',params.id);
    } else if ( params.ids ) {
      query = query.where('p.id IN ?',params.ids);
    }

    if ( params.nickname ) {
      query = query.where('u.nickname LIKE ?',params.nickname+'%');
    }
    
    if ( params.from ) {
      query = query.where('u.`from` LIKE ?',params.from+'%');
    }

    if ( params.user_id ) {
      query = query.where('u.`id` = ?',params.user_id);
    }

    if ( params.user_ids ) {
      query = query.where('u.`id` IN ?',params.user_ids);
    }

    if ( params.game_ids ) {
      query = query.where('g.`id` IN ?',params.game_ids);
    }

    return db.query(query);
  },
  

  /*
  get: Promise.coroutine(function* (params) {
    if ( !params.id && ( (!params.from && !params.number) || !params.to )) {
      console.error('params', params);
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

    let user = yield User.get(user_params);

    if ( ! user ) {
      return null;
    } else {
      let query = squel
                  .select({ autoEscapeFieldNames: true })
                  .field('p.id')
                  .field('p.created')
                  .field('p.blacklist')
                  .field('p.state_id')
                  .field('n.number','to')
                  .field('s.state', 'state')
                  .field('u.id', 'user_id')
                  .field('u.blacklist')
                  .field('u.nickname')
                  .from('players', 'p')
                  .left_join('game_numbers','n','n.id=p.`to`')
                  .left_join('player_states', 's', 's.id = p.state_id')
                  .left_join('users', 'u', 'u.id = p.user_id')
                  .where('u.id=?', user.id);

      if ( params.id ) {
        query = query.where('p.`id`=?', params.id);
      } else if ( params.to ) {
        query = query
                .where('n.number=?',params.to);
      }

      let players = yield db.query(query.toString());

      if ( ! players.length ) {
        return null;
      } else {

        let player = players[0];

        player.number = user.from;
        player.from = user.from;
        player.user_id = user.id;
        player.avatar = user.avatar;
        player.user = user;

        return player;
      }
    }
  }),
  */

  update: (player, params) => {
    //let whitelist = [
      //'to'
    //];

    let query = squel
                .update()
                .table('players', 'p')
                .where('p.id=?', player.id);

    let valid_query = false;
    //whitelist.map((key) => {
      //if ( params[key] ) {
        //valid_query = true;
        //query.set(key, params[key]);
      //}
    //});

    if ( params.to ) {
      valid_query = true;
      let game_number = squel
                        .select()
                        .field('id')
                        .from('game_numbers','n')
                        .where('number = ?', params.to);
      query.set('`to`', game_number);
    }

    if ( ! valid_query ) {
      throw "You must provide a valid key to update";
    }

    return db.query(query).then((rows) => {
      if ( rows && rows.changedRows ) {
        return Player.findOne(player.id);
      } else {
        return null;
      }
    });
  },
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
  },
  remove: (player_id) => {
    let query = squel
                .update()
                .set('archived', 1)
                .table('players', 'p')
                .where('p.id=?', player_id);

    return db.query(query).then((rows) => {
      if ( rows && rows.affectedRows ) {
        return {};
      } else {
        throw "Player was not deleted: " + player_id;
      }
    });
  }
};

module.exports = Player;
