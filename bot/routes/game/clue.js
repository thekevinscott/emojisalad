//const Promise = require('bluebird');
//const Player = require('models/player');
//const _ = require('lodash');
//const rule = require('config/rule');
const Game = require('models/game');

import getService from 'lib/getService';

import parse, {
  REQUEST,
  BOOL,
  MAP,
  RESPOND
} from 'lib/parse';

module.exports = (player, input) => {
  return getService('api').then(service => {
    return Game.get({ player_id: player.id }).then((games) => {
      const game = games[0];

      if ( !game.round.submission ) {
        return parse([{
          type: BOOL,
          params: {
            fn: () => {
              return player.id === game.round.submitter.id;
            },
            resolve: [{
              type: RESPOND,
              params: {
                message: {
                  key: 'no-clue-before-submission-for-submitter'
                },
                player
              }
            }],
            reject: [{
              type: RESPOND,
              params: {
                message: {
                  key: 'no-clue-before-submission-for-guesser'
                },
                player
              }
            }]

          }
        }]);
      } else {

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
        }, {
          type: MAP,
          params: {
            iterator: game.players
          },
          callback: [{
            type: RESPOND,
            params: {
              message: {
                key: 'clue_b',
                options: {
                  nickname: player.nickname,
                  avatar: player.avatar,
                  game
                }
              },
              player: 'props'
            }
          }]
        }]);
      }
    });
  });
};
