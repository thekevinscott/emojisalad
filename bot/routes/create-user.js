'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const User = require('models/user');
const _ = require('lodash');

module.exports = (from, input, to, protocol) => {
  console.info('lets create that user');
  return User.create({ from, protocol }).then((response) => {
    if ( response.error ) {
      console.error('Error creating user', response);
      throw new Error('Error creating user');
    } else {
      const user = response;
      console.info('created user', user);
      const player = _.extend(user, { to });
      return [{
        key: 'intro',
        player
      }];
    }
  });
};
