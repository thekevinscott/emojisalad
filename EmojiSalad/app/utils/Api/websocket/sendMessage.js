//import {
  //Alert,
//} from 'react-native';

import {
  fromTypeToApi,
} from './translate';

export default function sendMessage(websocket) {
  return (dispatch, {
    userKey,
    type,
    meta,
    payload,
  }) => {
    if (websocket.isOpen) {
      const packet = JSON.stringify({
        type: fromTypeToApi(type),
        userKey,
        meta: meta || {},
        payload,
      });
      //console.log('sending', packet);
      websocket.get('websocket').send(packet);
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        data: {
          message: 'There was an error communicating with the server.',
        },
      });
    }
  };
}
