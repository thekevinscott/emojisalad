/*
  var body = {
    apiKey: apiKey,
    userID: userID,
    badge: badge || 0,
    notification: {
      alert: note,
    }
  };

  $.post('/api/v1/notify', body, function(response) {
    $('#results').append(JSON.stringify(response) + '<br />');
  });
}
*/
import {
  fetch,
} from '../fetch';

import {
  PUSHCITY,
} from '../../config/app';

export default function pushNotification(userKey, body, options = {}) {
  return fetch(`${PUSHCITY.URL}notify`, {
    method: 'post',
    body: {
      apiKey: PUSHCITY.API_KEY,
      userID: userKey,
      badge: options.badge || 0,
      notification: {
        alert: body,
      },
    },
  });
}
