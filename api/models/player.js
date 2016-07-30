'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const User = require('models/user');
let Game;
const registry = require('microservice-registry');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
import setKey from 'setKey';

const Player = {
  // create a new player
  create: (params) => {
    if ( ! Game ) {
      Game = require('./game');
    }
    if ( ! params.from && ! params.user_id ) {
      throw new Error("you must provide a from or user_id field");
    }

    if ( ! params.game_id) {
      throw new Error("you must provide a game_id field");
    }

    let user_params = {};
    if ( params.user_id ) {
      user_params = { id: params.user_id };
    } else {
      user_params = { from: params.from };
    }

    return User.findOne(user_params).then((user) => {
      if ( ! user || !user.id ) {
        throw new Error('you must provide a valid from or user_id field');
      } else {
        return user;
      }
    }).then((user) => {
      //console.log('the player params, with sender id', player_params);
      return Game.findOne(params.game_id).then((game) => {
        if ( ! game || !game.id ) {
          throw new Error('You must provide a valid game_id');
        } else {
          return {
            game_id: game.id,
            user_id: user.id,
            to: params.to
          };
        }
      });
    }).then((player_params) => {
      if ( player_params.to === 0 ) {
        throw new Error('Invalid to provided', player_params);
      }
      //console.log('**** player params', player_params);
      const query = squel
      .insert({ autoQuoteFieldNames: true })
      .into('players')
      .setFields({
        to: player_params.to,
        created: squel.fval('NOW(3)'),
        user_id: player_params.user_id,
        game_id: player_params.game_id
      });

      return Player.findOne( player_params ).then((pl) => {
        return db.create(query.toString()).then((result) => {
          return setKey('players', {
            ...player_params,
            id: result.insertId,
          }).then(() => {
            return Player.findOne(result.insertId);
          });
        }).catch((err) => {
          console.error('err', err);
          throw err;
        });
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
    console.info('player find params', params);
    let archived = 0;
    if ( params.archived !== undefined ) {
      archived = params.archived;
    }

    let query = squel
                .select({ autoEscapeFieldNames: true })
                .field('p.id')
                .field('p.created')
                .field('p.archived')
                .field('p.`to`')
                //.field('n.number','to')
                //.field('p.state_id')
                .field('u.id', 'user_id')
                .field('g.id', 'game_id')
                //.field('u.blacklist')
                .field('u.nickname')
                .field('u.from')
                .field('u.blacklist')
                .field('u.avatar')
                .field('u.protocol')
                .field('u.archived', 'user_archived')
                .from('players', 'p')
                .where('p.archived=?', archived)
                .order('p.id')
                //.left_join('game_numbers','n','n.id=p.`to`')
                .left_join('games','g','g.id=p.game_id')
                .left_join('users', 'u', 'u.id=p.user_id');

    if ( params.id ) {
      query = query.where('p.id=?',params.id);
    } else if ( params.ids ) {
      query = query.where('p.id IN ?',params.ids);
    }

    if ( params.nickname ) {
      query = query.where('u.nickname LIKE ?',params.nickname+'%');
    }

    if ( params.to ) {
      //query = query.where('n.`number` = ?',params.to);
      query = query.where('p.`to` = ?',params.to);
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

    if ( params.protocol ) {
      query = query.where('u.protocol = ?',params.protocol);
    }

    if ( params.game_id ) {
      query = query.where('g.`id` = ?',params.game_id);
    } else if ( params.game_ids ) {
      query = query.where('g.`id` IN ?',params.game_ids);
    }

    //console.info('query', query.toString());
    return db.query(query);
  },
  /*
  update: (player, params) => {
    //let whitelist = [
      //'to'
    //];

    const query = squel
                  .update()
                  .table('players', 'p')
                  .where('p.id=?', player.id);

    let valid_query = false;

    //if ( params.to ) {
      //valid_query = true;
      //const game_number = squel
                          //.select()
                          //.field('id')
                          //.from('game_numbers','n')
                          //.where('number = ?', params.to);
      //query.set('`to`', game_number);
    //}

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
  */
  remove: (player_id) => {
    const query = squel
                  .update()
                  .set('archived', 1)
                  .table('players', 'p')
                  .where('p.id=?', player_id);

    return db.query(query).then((rows) => {
      if ( rows && rows.affectedRows ) {
        return {};
      } else {
        throw new Error("Player was not deleted: " + player_id);
      }
    });
  }
};

module.exports = Player;

const processEndpoint = (endpoint, params = {}) => {
  const parts = endpoint.split(/^(.*):\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)/);
  let rest;
  while ( ! rest && parts.length ) {
    rest = parts.pop();
  }
  const keys = Object.keys(params);
  const processed_rest = rest.split('/').map((piece) => {
    const index = keys.indexOf(piece.substring(1));
    if ( piece.substring(0,1) === ':' && index !== -1 ) {
      const key = keys[index];
      return params[key];
    } else {
      return piece;
    }
  });

  return [
    parts[1],
    '://',
    parts[2],
    parts[3],
    processed_rest.join('/')
  ].join('');
};
