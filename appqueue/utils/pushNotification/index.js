import fetch from '../fetch';
import getPushId from './getPushId';

import {
  ONE_SIGNAL,
} from '../../config/app';

//curl --include --request POST
     //--data-binary "{\"app_id\": \"f5e80a38-fcc6-4f7c-bfcf-fb82da346390\",
//\"contents\": {\"en\": \"Big Poppa\"},
//\"include_player_ids\": [\"a26ce097-5e75-4900-bf34-4e0db40e7a65\" ]}" \
export default function pushNotification(userKey, gameKey, body, options = {}) {
  const url = 'https://onesignal.com/api/v1/notifications';

  return getPushId(userKey).then(pushId => {
    const params = {
      app_id: ONE_SIGNAL.APP_ID,
      contents: {"en": "English Message"},
      included_segments: ["All"],
    };

    console.info('this is a push notification sending', url, params);

    return fetch(url, {
      method: 'post',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${ONE_SIGNAL.API_KEY}`,
      },
    });
  }).then(response => {
    console.log('got response back from', url, response);
    return response;
  });
}
