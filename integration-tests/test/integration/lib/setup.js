'use strict';
const Promise = require('bluebird');
const request = require('superagent');
//const req = require('./req');
const _ = require('lodash');
const sequence = require('./sequence');
//const game_numbers = require('../../../../config/numbers');
const game_numbers = [
  '+15551111111',
  '+15552222222',
  '+15553333333',
  '+15554444444',
  '+15559999999',
];

const port = 5999;
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

      request
      .post(`http://localhost:${port}/receive`)
            .send(message)
      .end((err, res) => {
        console.log('**** end', err, res);
        if ( err ) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }));
}

module.exports = setup;
