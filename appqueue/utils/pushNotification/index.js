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
import fetch from '../fetch';

import {
  PUSHCITY,
} from '../../config/app';

export default function pushNotification(userKey, body, options = {}) {
  const url = `${PUSHCITY.URL}notify`;
  const params = {
    apiKey: PUSHCITY.API_KEY,
    userID: userKey,
    badge: options.badge || 0,
    notification: {
      alert: body,
    },
  };
  console.info('this is a push notification sending', url, params);
  fetch(`${PUSHCITY.URL}`).then(response => {
    console.log('got the response from root', response);
  });
  return fetch(url, {
    method: 'post',
    body: params,
  }).then(response => {
    console.log('got response back from', url, response);
    return response;
  });
}
