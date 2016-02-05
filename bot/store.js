'use strict';
const Promise = require('bluebird');
const db = require('db');
const squel = require('squel').useFlavour('mysql');
const mongodb = Promise.promisifyAll(require('mongodb'));
const using = Promise.using;

const url = require('config/db').mongo;

const store = (key, val) => {
  return using(
    getConnectionAsync(),
    (connection) => {
      //console.debug('connection has been gotten');
      const coll = connection.collection('attributes');
      //console.log('coll', coll);
      if ( val !== undefined ) {
        //console.log('set');
        return coll.updateAsync({ key: key }, {
          key: key,
          val: val
        }, {
          upsert: true
        });
      } else {
        //console.debug('mongo get');
        return coll.findOneAsync({ key: key }).then((item) => {
          //console.debug('For key', key, 'found item', item);
          if ( item ) {
            return item.val;
          }
        });
      }
    }
  ).then((data) => {
    return data;
  });
}

const getConnectionAsync = () => {
  //console.debug('get connection async');
  return mongodb.MongoClient.connectAsync(url)
  .disposer((connection) => {
    //console.debug('close mongo connection');
    connection.close();
  });
}

module.exports = store;
