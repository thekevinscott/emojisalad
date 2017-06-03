import fetchFromService from '../../../utils/fetchFromService';
import sendMessage from '../sendMessage';
import fb from '../routes/fb';
import {
  SEND_FRIENDS,
} from './types';

export default function fetchUserFriends(ws, user) {
  console.info('user we are checking', user);
  return fb(null, {
    token: user.facebookToken,
    path: [
      'me/friends',
      'me/invitable_friends',
    ]
  }).then(result => {
    const contacts = {
      friends: result['me/friends'].data,
      invitable_friends: result['me/invitable_friends'].data,
    };

    return fetchFromService({
      service: 'api',
      route: 'users.updateFriends',
      routeParams: {
        user_id: user.id,
      },
      options: {
        body: {
          user_key: user.key,
          contacts,
        },
      },
    });
  }).then(data => {
    console.info('got friends back', data);
    sendMessage(ws)({
      type: SEND_FRIENDS,
      data,
    });
  }).catch(err => {
    console.error('err', err);
  });
}
