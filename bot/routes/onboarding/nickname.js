'use strict';

import getService from 'lib/getService';
import rule from 'config/rule';

import parse, {
  REQUEST,
  MAP,
  RESPOND
} from 'lib/parse';

module.exports = (user, nickname) => {
  return getService('api').then(service => {
    if ( !rule('yes').test(nickname) ) {
      const to = user.to;
      return parse([{
        type: REQUEST,
        params: {
          url: `${service.base_url}users/${user.id}`,
          method: 'put',
          body: {
            nickname,
          }
        },
        callback: [{
          type: RESPOND,
          params: {
            meta: { to: user.to },
            message: {
              key: 'intro_3_b',
              options: {
                nickname: nickname.trim(),
                avatar: user.avatar
              }
            },
            player: {
              ...user,
              to
            }
          }
        }]
      }]);
    }
  });
};
