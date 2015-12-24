'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const User = {
  create: Promise.coroutine(function* (params) {
    if ( ! params.from ) {
      throw "You must provide a from field for a user";
    }
    let avatar = yield this.getRandomAvatar();
    let query = squel
                .insert({ autoQuoteFieldNames: true })
                .into('users')
                .setFields({
                  created: squel.fval('NOW(3)'),
                  last_activity: squel.fval('NOW(3)'),
                  from: params.from,
                  avatar: avatar
                });

    let rows = yield db.query(query);

    if ( rows && rows.insertId ) {
      let user = {
        id: rows.insertId,
        from: params.from
      };
      return user;
    } else {
      console.error(query.toString());
      throw "There was an error inserting user";
    }

  }),
  update: Promise.coroutine(function* (user, params) {
    let whitelist = [
      'nickname',
      'blacklist',
      'maximum_games',
      'avatar'
    ];
    let query = squel
                .update()
                .table('users', 'u')
                .where('u.id=?', user.id);

    whitelist.map(function(key) {
      if ( params[key] ) {
        query.set(key, params[key]);
      }
    });

    yield db.query(query.toString());
    return user;
  }),
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

    let rows = yield db.query(query.toString());
    if ( rows.length ) {
      return rows[0].players;
    } else {
      return null;
    }
  }),
  get: Promise.coroutine(function* (params) {
    let query = squel
                .select()
                .field('u.*')
                .from('users', 'u');

    if ( params.id ) {
      query = query.where('u.id=?',params.id);
    }
    
    if ( params.from ) {
      query = query.where('u.`from`=?',params.from);
    }
    
    if ( params.player_id ) {
      query = query
              .left_join('players', 'p', 'u.id=p.user_id')
              .where('p.id=?',params.player_id);
    }

    let rows = yield db.query(query.toString());
    if ( rows.length ) {
      let user = rows[0];
      // TODO: Set this intelligently.
      return user;
    } else {
      return null;
    }
  }),
  getRandomAvatar: Promise.coroutine(function* () {
    let query = squel
                .select()
                .field('avatar')
                .from('avatars')
                .order('rand()')
                .limit(1);

    let rows = yield db.query(query);
    return rows[0].avatar;
  })
};

module.exports = User;
