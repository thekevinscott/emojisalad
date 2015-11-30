'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const User = {
  create: Promise.coroutine(function* (params) {
    if ( ! params.from ) {
      throw "You must provide a from field for a user";
    }
    //console.log('put user query together', params);
    let query = squel
                .insert({ autoQuoteFieldNames: true })
                .into('users')
                .setFields({
                  created: squel.fval('NOW(3)'),
                  last_activity: squel.fval('NOW(3)'),
                  from: params.from
                });

                //console.log('query', query.toString());
    let rows = yield db.query(query);

    if ( rows && rows.insertId ) {
      let user = {
        id: rows.insertId,
        from: params.from
      };
      //console.log('return user', user);
      return user;
    } else {
      console.error(query.toString());
      throw "There was an error inserting user";
    }

  }),
  update: Promise.coroutine(function* (user, params) {
    let query = squel
                .update()
                .table('users', 'u')
                .where('u.id=?', user.id);

    if ( params.nickname ) {
      query.set('nickname', params.nickname);
    }

    if ( params.blacklist !== undefined ) {
      query.set('blacklist', params.blacklist);
    }


    yield db.query(query.toString());
    return user;
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
      return user;
    } else {
      return null;
    }
  })
};

module.exports = User;
