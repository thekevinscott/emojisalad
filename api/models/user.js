'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const default_maximum_games = 4;

const User = {
  create: function(params) {
    if ( ! params.from ) {
      throw "You must provide a from field for a user";
    }

    let nickname = '';
    if ( params.nickname ) {
      nickname = params.nickname;
    }

    return this.getRandomAvatar().then((avatar) => {
      let query = squel
                  .insert({ autoQuoteFieldNames: true })
                  .into('users')
                  .setFields({
                    created: squel.fval('NOW(3)'),
                    last_activity: squel.fval('NOW(3)'),
                    from: params.from,
                    avatar: avatar,
                    nickname: nickname,
                    maximum_games: default_maximum_games
                  });
      return db.query(query).then((result) => {

        if ( result && result.insertId ) {
          let user = {
            id: result.insertId,
            from: params.from,
            avatar: avatar,
            nickname: nickname,
            maximum_games: default_maximum_games
          };
          return user;
        } else {
          console.error(query.toString());
          throw "There was an error inserting user";
        }
      });
    });
  },
  update: (user, params) => {
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
        return User.findOne(user.id);
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

    let rows = yield db.query(query.toString());
    if ( rows.length ) {
      return rows[0].players;
    } else {
      return null;
    }
  }),
  find: (params = {}) => {
    let query = squel
                .select()
                .field('u.*')
                .from('users', 'u');

    if ( params.id ) {
      query = query.where('u.id=?',params.id);
    }

    if ( params.nickname ) {
      query = query.where('u.nickname LIKE ?',params.nickname+'%');
    }
    
    if ( params.from ) {
      query = query.where('u.`from` LIKE ?',params.from+'%');
    }

    if ( params.player_id ) {
      query = query
              .left_join('players', 'p', 'u.id=p.user_id')
              .where('p.id=?',params.player_id);
    }
              
    const archived = params.archived || 0;
    query.where('u.archived=?', archived);

    return db.query(query);
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
  getRandomAvatar: () => {
    let query = squel
                .select()
                .field('avatar')
                .from('avatars')
                .order('rand()')
                .limit(1);

    //console.debug(query.toString());

    return db.query(query).then((rows) => {
      return rows[0].avatar;
    });
  },
  remove: (user_id) => {
    let query = squel
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

module.exports = User;
