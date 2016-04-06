'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const Emoji = require('models/emoji');

let Player;
const default_maximum_games = 4;

const User = {
  create: (params) => {
    console.info('API: User create', params);
    if ( ! params.from ) {
      throw "You must provide a from field for a user";
    }
    if ( ! params.protocol_id ) {
      throw "You must provide a protocol id for a user";
    }

    let nickname = '';
    if ( params.nickname ) {
      nickname = params.nickname;
    }

    console.info('create user 1');
    return Emoji.getRandom().then((result) => {
      console.info('create user 2', result);
      const avatar = result.emoji;
      console.info('create user 3');
      const number = params.from;
      console.info('parsed the number', number);
      const query = squel
                    .insert({ autoQuoteFieldNames: true })
                    .into('users')
                    .setFields({
                      created: squel.fval('NOW(3)'),
                      last_activity: squel.fval('NOW(3)'),
                      from: number,
                      avatar,
                      nickname,
                      protocol_id: params.protocol_id,
                      maximum_games: default_maximum_games
                    });
      return db.create(query).then((result) => {
        return User.findOne(result.insertId).then((user) => {
          return user;
        });
      });
    });
  },
  update: (user, params) => {
    const whitelist = [
      'nickname',
      'blacklist',
      'maximum_games',
      'avatar',
      'confirmed',
      'confirmed_avatar'
    ];
    const query = squel
                  .update()
                  .table('users', 'u')
                  .where('u.id=?', user.id);

    let valid_query = false;
    whitelist.map((key) => {
      if ( params[key] ) {
        valid_query = true;
        query.set(key, params[key]);
      }
    });

    if ( ! valid_query ) {
      throw "You must provide a valid key to update";
    }

    return db.query(query).then((rows) => {
      if ( rows && rows.changedRows ) {
        return User.findOne(user.id).then((user) => {
          return user;
        });
      } else {
        return null;
      }
    });
  },
  getPlayersNum: Promise.coroutine(function* (params) {
    let query = squel
                .select()
                .field('count(1) as players')
                .from('users', 'u')
                .left_join('players', 'p', 'p.user_id=u.id')
                ;

    if ( params.id ) {
      query = query.where('u.id=?',params.id);
    }
    if ( params.from ) {
      query = query.where('u.`from`=?',params.from);
    }

    const rows = yield db.query(query.toString());
    if ( rows.length ) {
      return rows[0].players;
    } else {
      return null;
    }
  }),
  find: (params = {}) => {
    if ( ! Player ) {
      Player = require('models/player');
    }

    const number_of_players = squel
                              .select()
                              .field('count(id)')
                              .from('players', 'p')
                              .where('p.user_id=u.id');

    let query = squel
                .select()
                .field('(' + number_of_players.toString() + ')', 'number_of_players')
                .field('u.*')
                .left_join('players', 'p', 'u.id=p.user_id')
                .from('users', 'u');

    if ( params.id ) {
      query = query.where('u.id=?',params.id);
    } else if ( params.ids ) {
      query = query.where('u.id IN ?',params.ids);
    }

    if ( params.nickname ) {
      query = query.where('u.nickname LIKE ?',params.nickname+'%');
    }

    if ( params.from ) {
      query = query.where('u.`from` LIKE ?',params.from+'%');
    }

    if ( params.protocol_id ) {
      query = query.where('u.`protocol_id` = ?',params.protocol_id);
    }

    if ( params.player_id ) {
      query = query
              .where('p.id=?',params.player_id);
    }

    const archived = params.archived || 0;
    query = query.where('u.archived=?', archived);
    query = query.group('u.id');

    return db.query(query).then((users) => {
      if ( users.length ) {
        return Player.find({ user_ids: users.map(user => user.id ) }).then((players) => {

          const players_by_id = arrayToObj(players, 'user_id', (player) => {
            return {
              id: player.id,
              to: player.to
            };
          });
          return users.map((user) => {
            user.players = players_by_id[user.id] || [];
            return user;
          });
        }).then((users) => {
          return users;
        });
      } else {
        return [];
      }
    });
  },
  findOne: (params) => {
    if (parseInt(params)) {
      params = { id: params };
    }
    return User.find(params).then((users) => {
      if ( users && users.length) {
        return users[0];
      } else {
        return {};
      }
    });
  },
  remove: (user_id) => {
    const query = squel
                  .update()
                  .set('archived', 1)
                  .table('users', 'u')
                  .where('u.id=?', user_id);

    return db.query(query).then((rows) => {
      if ( rows && rows.affectedRows ) {
        return {};
      } else {
        throw "User was not deleted: " + user_id;
      }
    });
  }
};

//function arrayToObj(players) {
  //return players.reduce((obj, player) => {
    //const user_id = player.user_id;
    //delete player.user_id;
    //if ( ! obj[user_id] ) {
      //obj[user_id] = [];
    //}

    //obj[user_id].push({
      //id: player.id,
      //to: player.to
    //});
    //return obj;
  //}, {});
//}

function arrayToObj(arr, key, callback) {
  return arr.reduce((obj, el) => {
    if ( ! obj[el[key]] ) {
      obj[el[key]] = [];
    }

    obj[el[key]].push(callback(el));
    return obj;
  }, {});
}

module.exports = User;
