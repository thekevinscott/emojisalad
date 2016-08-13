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
      const apiType = fromTypeToApi(type);
      const packet = JSON.stringify({
        type: apiType,
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
