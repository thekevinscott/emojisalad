'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
//const Invite = require('models/invite');
const User = require('models/user');
const rule = require('config/rule');
import getService from 'lib/getService';

import parse, {
  REQUEST,
  BOOL,
  MAP,
  RESPOND
} from 'lib/parse';
//const _ = require('lodash');

module.exports = (user, input) => {
  return getService('api').then(service => {
    console.info('confirm route');
    return parse([{
      type: BOOL,
      params: {
        regexp: '^yes|^yeah|^yea|^y$',
        flags: 'i',
        string: input,
        resolve: [{
          type: REQUEST,
          params: {
            url: `${service.base_url}users/${user.id}`,
            method: 'put',
            body: {
              confirmed: 1
            }
          },
          callback: [{
            type: RESPOND,
            params: {
              meta: { to: user.to },
              message: {
                key: 'intro_2'
              },
              player: {
                ...user
              }
            }
          }]
        }],
        reject: [{
          type: BOOL,
          params: {
            regexp: '^no|^nope|^fuck off$',
            flags: 'i',
            string: input,
            resolve: [{
              type: REQUEST,
              params: {
                url: `${service.base_url}users/${user.id}`,
                method: 'put',
                body: {
                  blacklist: 1
                }
              }
            }],
            reject: [{
              type: RESPOND,
              params: {
                message: {
                  key: 'onboarding_wtf'
                },
                player: {
                  ...user
                }
              }
            }]
          }
        }]
      }
    }]);
  });
};
