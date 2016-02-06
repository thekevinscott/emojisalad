'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const req = require('./req');
const _ = require('lodash');
const sequence = require('./sequence');
const services = require('config/services');
//const game_numbers = require('../../../../config/numbers');
const game_numbers = [
  '+15551111111',
  '+15552222222',
  '+15553333333',
  '+15554444444',
  '+15559999999',
];

let callback = () => {}
const app = require('./server');
app.post('/', (res) => {
  callback(res);
});

const port = services.testqueue.port;
function setup(arr) {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  return sequence(arr.map((a, i) => {
    const player = a.player;
    const msg = a.msg;
    const to = a.to || game_numbers[0];
    if ( ! player ) {
      console.error(a, i);
      reject("No player provided");
    }
    if ( ! msg ) {
      console.error('index', i, 'array', arr);
      reject("No msg provided");
    }
    return new Promise((resolve, reject) => {
      const message = {
        body: msg,
        to: to || player.to,
        from: player.number
      };

      const url = `http://localhost:${port}/receive`;

      callback = (res) => {
        console.log('********** HUZZZZZZZAH', message, res.body);
        resolve(res);
      };

      request({
        url: url,
        method: 'post',
        form: message
      }).then((res) => {
        console.log('res', res);
        //if ( err ) {
          //reject(err);
        //} else {
          //resolve(res);
        //}
      }).catch((err) => {
        console.error(err);
      });
    });
  }));
}

module.exports = setup;
