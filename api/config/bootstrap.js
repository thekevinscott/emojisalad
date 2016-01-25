/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
'use strict';
const Promise = require('bluebird');

function createAll(model, arr, key) {
  return Promise.all(arr.map((el) => {
    let where = {};
    where[key] = el;
    return model.findOrCreate({ where: where});
  }));
}

module.exports.bootstrap = function(cb) {
  const emojis = [ '⚽️', '⚾️', '⛄️', '⚡️', '☂' ];
  const states = [
    'waiting-for-confirmation',
    'waiting-for-nickname',
    'waiting-for-invites',
    'ready-for-game',
    'waiting-for-round',
    'waiting-for-submission',
    'guessing',
    'playing',
    'uncreated',
    'submitted',
    'bench',
    'passed',
    'lost',
    'invited-to-new-game',
    'waiting-for-avatar',
  ]

  createAll(Emoji, emojis, 'emoji').then(() => {
    return createAll(State, states, 'state');
  }).then(() => { cb(); });

};
