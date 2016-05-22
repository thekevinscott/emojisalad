'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const _ = require('lodash');
const rule = require('config/rule');

import getService from 'lib/getService';

import parse, {
  REQUEST,
  BOOL,
  MAP,
  RESPOND
} from 'lib/parse';

module.exports = (game, player, input) => {
  return getService('api').then(service => {
    return parse([{
      type: MAP,
      params: {
        iterator: game.players
      },
      callback: [{
        type: BOOL,
        params: {
          fn: iteratee => player.id !== iteratee.id,
          resolve: [{
            type: RESPOND,
            params: {
              message: {
                key: 'says_b',
                options: {
                  nickname: player.nickname,
                  avatar: player.avatar,
                  input
                }
              },
              player: 'props'
            }
          }]
        }
      }]
    }]);
  });
};
