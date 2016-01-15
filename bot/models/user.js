'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const req = Promise.promisify(require('request'));
const request = function(options) {
  return req(options).then(function(response) {
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error('No response from API');
    }
  });
}

const User = {
  create: function (params) {
    return request({
      url: 'http://localhost:1337/users',
      method: 'POST',
      form: params
    });


    /*
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

    console.debug(query.toString());
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
    */

  },
  update: Promise.coroutine(function* (user, params) {
    return request({
      url: 'http://localhost:1337/users/'+user.id,
      method: 'PUT',
      form: params
    });
    /*
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
    */
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
  // TODO: Rename this getOne
  get: function (params) {
    return request({
      url: 'http://localhost:1337/users',
      method: 'GET',
      qs: params
    }).then(function(response) {
      if ( response ) {
        return response[0];
      } 
    });
  },
  getRandomAvatar: Promise.coroutine(function* () {
    let query = squel
                .select()
                .field('avatar')
                .from('avatars')
                .order('rand()')
                .limit(1);

    console.debug(query.toString());
    let rows = yield db.query(query);
    console.debug('avatar', rows);
    return rows[0].avatar;
  })
};

module.exports = User;
