'use strict';
const Promise = require('bluebird');
const db = require('db');
const squel = require('squel').useFlavour('mysql');
//const mongodb = Promise.promisifyAll(require('MongoDB'));

function store(key, val) {
  if ( val !== undefined ) {
    // setter
    let query = squel
                .insert({ autoEscapeFieldNames: true })
                .into('attributes')
                .setFields({
                  '`key`': key,
                  value: val 
                })
                .onDupUpdate('value', val);

              console.debug(query.toString());

    return db.query(query);
  } else {
    // getter

    let query = squel
                .select({ autoEscapeFieldNames: true })
                .from('attributes')
                .where('`key`=?', key)
                console.debug(query.toString());


    return db.query(query).then(function(rows) {
      if ( rows && rows.length ) {
        return rows[0].value;
      }
    });
  }
}

function getConnectionAsync() {
  let url = 'mongodb://localhost:27017/bot';
  //return mongodb.MongoClient.connectAsync(url)
  //.disposer(function(connection){
    //connection.close();
  //});
  //return mongodb.MongoClient.connectAsync(url);
}

module.exports = store;
