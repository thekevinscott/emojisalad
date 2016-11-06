// a separate router. all routes come in to platforms which then routes them here.
'use strict';

const registry = require('microservice-registry');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const Player = require('models/player');
const _ = require('lodash');
const User = require('models/user');

function getNextSenderID(protocol, player_sender_ids) {
  const service = registry.get(protocol);
  const options = {
    url: service.api.senders.get.endpoint,
    method: service.api.senders.get.method,
    qs: {
      exclude: (player_sender_ids) ? player_sender_ids.join(',') : null
    }
  };

  return request(options).then(response => {
    try {
      return JSON.parse(response.body);
    } catch (err) {
      console.error('error parsing json response', response.body);
      throw new Error('Error getting sender');
    }
  }).then(response => {
    if ( response && response.id ) {
      return response.id;
    }
  });
}
const Router = (phone) => {
  if (!phone) {
    return Promise.resolve([]);
  }

  console.info(`===========Web Index: ${phone}`);
  const protocol = 'sms';
  return User.get({
    from: phone,
    protocol
  }).then((users) => {
    if (users.length) {
      const user = users.pop();
      //console.info('user exists', user);
      if (user.number_of_players > 0) {
        console.info('user has players');
        if (user.number_of_players < user.maximum_games) {
          const exclude_ids = user.players.map(player => {
            return player.to;
          });
          return getNextSenderID(user.protocol, exclude_ids).then(to => {
            console.log('the to', to);
            // new game
            return require('../game/new_game')(Object.assign({}, user, {
              to
            }));
          });
        }
      } else {
        console.info('user has no players');
        // currently onboarding, ignore
        return null;
      }
    } else {
      console.info('lets create that user');
      return User.create({ from: phone, protocol }).then(response => {
        if ( response.error ) {
          console.error('Error creating user', response);
          throw new Error('Error creating user');
        } else {
          const user = response;
          console.info('created user', user);
          return getNextSenderID(user.protocol).then(to => {
            const player = _.extend(user, { to });
            return [{
              key: 'intro',
              player
            }];
          });
        }
      });
    }
  });
};

module.exports = Router;
