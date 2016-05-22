//const Promise = require('bluebird');
//const Player = require('models/player');
const User = require('models/user');
const _ = require('lodash');

import getService from 'lib/getService';

import parse, {
  REQUEST,
  BOOL,
  MAP,
  RESPOND
} from 'lib/parse';

module.exports = (from, input, to, protocol) => {
  return getService('api').then(service => {
    return parse([{
      type: REQUEST,
      params: {
        url: `${service.base_url}users/`,
        method: 'post',
        body: {
          from,
          protocol,
          to
        }
      },
      callback: [{
        type: RESPOND,
        params: {
          message: {
            key: 'intro'
          },
          player: 'props' // TEMPORARY; this will be removed because it sucks, and we should get the props from the top level Respond object.
        }
      }]
    }]);
  });
};
