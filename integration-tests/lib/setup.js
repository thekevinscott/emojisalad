/**
 * Setup is a convenience function used for various tests.
 *
 * It's basically a shorthand of providing an array of messages
 * to be sent out as requests to a particular queue (in
 * this case, testqueue) in a sequential order.
 *
 * It returns a promise indicating whether or not
 * all messages are sent successfully or not. The promise
 * will not contain any return data; that would come later.
 *
 */
'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const req = require('./req');
const _ = require('lodash');
const sequence = require('./sequence');
const services = require('config/services');
//const game_numbers = require('../../../../config/numbers');
//const game_numbers = [
  //'+15551111111',
  //'+15552222222',
  //'+15553333333',
  //'+15554444444',
  //'+15559999999',
//];

const port = services.testqueue.port;
function setup(arr) {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  return sequence(arr.map((a, i) => {
    const player = a.player;
    const msg = a.msg;
    if ( ! player.to && ! a.to ) {
      throw "Now you must provide an explicit to";
    }
    //const to = a.to || game_numbers[0];
    const to = a.to || player.to;
    if ( ! player ) {
      console.error(a, i);
      reject("No player provided");
    }
    if ( ! msg ) {
      console.error('index', i, 'array', arr);
      reject("No msg provided");
    }
    return () => {
      const message = {
        body: msg,
        to: to || player.to,
        from: player.number
      };

      const url = `http://localhost:${port}/receive`;

      return request({
        url: url,
        method: 'post',
        form: message
      }).then((res) => {
        if ( res && res.body ) {
          let body = res.body;
          try {
            body = JSON.parse(body);
          } catch(err) {}
          return body;
        }
        //console.log('res', res);
        //if ( err ) {
        //reject(err);
        //} else {
        //resolve(res);
        //}
      }).catch((err) => {
        console.error(err);
      });
    }
  }));
}

module.exports = setup;
