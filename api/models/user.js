'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const Emoji = require('models/emoji');
const Challenge = require('models/challenge');
import setKey from 'setKey';

let Player;
const default_maximum_games = 4;

const limit = (contacts, num) => {
  return Object.keys(contacts).slice(0, num).reduce((obj, key) => ({
    ...obj,
    [key]: contacts.key,
  }), {});
};

const getDefaultMaximumGames = ({ protocol }) => {
  if (protocol === 'appqueue') {
    return 9999;
  }

  return default_maximum_games;
};

function arrayToObj(arr, key, callback) {
  return arr.reduce((obj, el) => {
    if ( ! obj[el[key]] ) {
      obj[el[key]] = [];
    }

    obj[el[key]].push(callback(el));
    return obj;
  }, {});
}

const User = {
  create: (params) => {
    console.info('API: User create', params);
    //if ( ! params.from ) {
      //throw new Error("You must provide a from field for a user");
    //}

    if ( ! params.protocol ) {
      throw new Error("You must provide a protocol id for a user");
    }

    let nickname = '';
    if ( params.nickname ) {
      nickname = `${params.nickname}`.trim();
    }

    let from = null;
    if ( params.from) {
      from = params.from;
    }

    let facebookId = null;
    if (params.facebookId) {
      facebookId = params.facebookId;
    }

    let facebookToken = null;
    if (params.facebookToken) {
      facebookToken = params.facebookToken;
    }

    let facebookTokenExpiration = null;
    if (params.facebookTokenExpiration) {
      facebookTokenExpiration = params.facebookTokenExpiration;
    }

    let facebookPermissions = null;
    if (params.facebookPermissions) {
      facebookPermissions = params.facebookPermissions;
    }

    console.info('create user 1');
    return Emoji.getRandom().then((result) => {
      console.info('create user 2', result);
      const avatar = result.emoji;
      console.info('create user 3', params);
      console.info('parsed the number', from);
      const confirmed = params.confirmed || 0;
      const confirmed_avatar = params.confirmed_avatar || 0;

      // If we're passing a facebook ID, we need to do
      // a manual search to see if we've already inserted
      // this user
      if (facebookId) {
        return User.findOne({ facebookId }).then(user => {
          if (user) {
            return {
              key: user.key,
              confirmed,
              confirmed_avatar,
              avatar,
            };
          }

          return {
            confirmed,
            confirmed_avatar,
            avatar,
          };
        });
      }

      return {
        confirmed,
        confirmed_avatar,
        avatar,
      };
    }).then(({
      key,
      confirmed,
      confirmed_avatar,
      avatar,
    }) => {
      let query;
      let method = 'create';
      if (!key) {
        query = squel
        .insert({ autoQuoteFieldNames: true })
        .into('users')
        .setFields({
          created: squel.fval('NOW(3)'),
          //last_activity: squel.fval('NOW(3)'),
          confirmed,
          confirmed_avatar,
          from,
          avatar,
          nickname,
          protocol: params.protocol,
          maximum_games: getDefaultMaximumGames(params),
          facebookId,
          facebookToken,
          facebookPermissions,
          facebookTokenExpiration,
        });
      } else {
        method = 'query';
        query = squel
        .update({ autoQuoteFieldNames: true })
        .table('users')
        .set('facebookToken', facebookToken)
        //.set('updated', squel.fval('NOW(3)'))
        .where('`key` = ?', key);
      }

      return db[method](query).then((queryResult) => {
        if (method === 'create') {
          return setKey('users', {
            ...params,
            id: queryResult.insertId,
          }).then(() => {
            return { queryResult };
          });
        }

        return { queryResult, params };
      }).then(({ queryResult, params }) => {
        if (queryResult.insertId) {
          return User.findOne(queryResult.insertId);
        }

        return User.findOne(params);
      }).then(user => {
        if (user.protocol === 'appqueue') {
          console.info('UPDATE APP QUEUE USER', user);
          // we set the user from to match the user key
          return User.update({
            key: user.key
          }, {
            from: user.key,
          }).then(() => {
            return {
              ...user,
              from: user.key,
            };
          });
        }

        return user;
      }).then(user => {
        return {
          ...user,
          to: params.to,
        };
      });
    });
  },
  update: (user, params) => {
    console.info('user update', user, params);
    const whitelist = [
      'from',
      'nickname',
      'blacklist',
      'maximum_games',
      'avatar',
      'confirmed',
      'confirmed_avatar',
      'protocol',
      'registered',
      'facebookToken',
      'facebookPermissions',
      'facebookTokenExpiration',
    ];
    let query = squel
                  .update({ autoQuoteFieldNames: true })
                  .table('users', 'u');

    if (user.id) {
      query = query.where('u.id=?', user.id);
    } else if (user.key) {
      query = query.where('u.key=?', user.key);
    }

    let valid_query = false;
    whitelist.map((key) => {
      if ( params[key] ) {
        valid_query = true;
        query.set(key, params[key]);
      }
    });

    if ( ! valid_query ) {
      throw new Error("You must provide a valid key to update");
    }

    console.info('user update query', query.toString());
    return db.query(query).then((rows) => {
      if ( rows && rows.affectedRows ) {
        return User.findOne(user);
      } else {
        return null;
      }
    });
  },
  updateFriends: (user, params) => {
    const facebookIds = params.contacts.friends.map(friend => friend.id);
    return User.find({ facebookIds }).then(users => {
      const usersByFacebookId = users.reduce((obj, user) => ({
        ...obj,
        [user.facebookId]: user,
      }), {});

      const friendsWithKeys = params.contacts.friends.map(friend => {
        return {
          ...friend,
          key: usersByFacebookId[friend.id].key,
        };
      });
      //console.info('user update friends', user, params);
      const friends = JSON.stringify(friendsWithKeys);
      const invitable_friends = JSON.stringify(params.contacts.invitable_friends);
      const query = squel
                  .insert({ autoQuoteFieldNames: true })
                  .into('friends')
                  .setFields({
                    user_key: params.user_key,
                    updated: squel.fval('NOW()'),
                    friends,
                    invitable_friends,
                  })
                  .onDupUpdate('friends', friends)
                  .onDupUpdate('invitable_friends', invitable_friends);

      return db.create(query).then(() => {
        return {
          friends: limit(friendsWithKeys, 100),
          invitable_friends: params.contacts.invitable_friends,
        };
      });
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
                .field(`(${number_of_players.toString()})`, 'number_of_players')
                .field('u.*')
                .left_join('players', 'p', 'u.id=p.user_id')
                .from('users', 'u');

    let someWhereStatement = false;
    if ( params.id ) {
      someWhereStatement = true;
      query = query.where('u.id=?',params.id);
    } else if ( params.ids ) {
      someWhereStatement = true;
      query = query.where('u.id IN ?',params.ids);
    }

    if ( params.nickname ) {
      someWhereStatement = true;
      query = query.where('u.nickname LIKE ?',`${params.nickname}%`);
    }

    if ( params.facebookId ) {
      someWhereStatement = true;
      query = query.where('u.facebookId = ?',params.facebookId);
    } else if ( params.facebookIds ) {
      someWhereStatement = true;
      query = query.where('u.facebookId IN ?',[].concat(params.facebookIds));
    }

    if ( params.from ) {
      someWhereStatement = true;
      query = query.where('u.`from` LIKE ?',`${params.from}%`);
    }

    if ( params.protocol ) {
      someWhereStatement = true;
      query = query.where('u.`protocol` = ?',params.protocol);
    }

    if ( params.player_id ) {
      someWhereStatement = true;
      query = query
              .where('p.id=?',params.player_id);
    }

    if ( params.key ) {
      someWhereStatement = true;
      query = query.where('u.key=?',params.key);
    }

    const archived = params.archived || 0;
    query = query.where('u.archived=?', archived);
    query = query.group('u.id');

    if (!someWhereStatement) {
      throw new Error('You must select a user by something');
    }

    return db.query(query).then((users) => {
      if ( users.length ) {
        return Player.find({ user_ids: users.map(user => user.id ) }).then((players) => {

          const players_by_id = arrayToObj(players, 'user_id', (player) => {
            return {
              id: player.id,
              to: player.to
            };
          });

          return Promise.all(users.map((user) => {
            user.players = players_by_id[user.id] || [];
            return Challenge.guesses({
              protocol: user.protocol,
              from: user.from,
            }).then(challenge_guesses => {
              return {
                ...user,
                challenge_guesses,
              };
            });
          }));
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
        throw new Error(`User was not deleted: ${user_id}`);
      }
    });
  },
};

module.exports = User;
