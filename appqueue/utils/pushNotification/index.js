import fetch from '../fetch';
import getPushId from './getPushId';

import {
  ONE_SIGNAL,
} from '../../config/app';

const getBody = params => Object.keys(params).reduce((obj, key) => {
  const enKeys = [
    'headings',
    'subtitle',
    'contents',
  ];

  const val = params[key];

  if (enKeys.indexOf(key) > -1) {
    return {
      ...obj,
      [key]: {
        en: val
      },
    };
  }

  if (key === 'title') {
    return {
      ...obj,
      headings: {
        en: val,
      },
    };
  }

  if (key === 'badge') {
    return {
      ...obj,
      ios_badgeCount: val,
    };
  }

  return {
    ...obj,
    [key]: val,
  };
}, {});

export default function pushNotification(userKey, gameKey, message, options = {}) {
  const url = 'https://onesignal.com/api/v1/notifications';

  return getPushId(userKey).then(pushId => {
    const body = {
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      ...getBody({
        ...options,
        contents: message,
      }),
      data: {
        gameKey,
        ...(options.data || {}),
      },
      app_id: ONE_SIGNAL.APP_ID,
      include_player_ids: [pushId],
    };

    console.info('this is a push notification sending', url, body);

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${ONE_SIGNAL.API_KEY}`,
    };

    return fetch(url, {
      method: 'POST',
      headers,
      body,
    });
  }).then(response => {
    console.log('got response back from', url, response);
    return response;
  }).catch(error => {
    console.log('error', error);
    return {
      error,
    };
  });
}
