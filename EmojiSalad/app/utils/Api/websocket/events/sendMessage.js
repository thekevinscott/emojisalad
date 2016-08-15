import {
  dispatch,
  getStore,
} from '../utils/store';

import {
  fromTypeToApi,
} from '../translate';

const getPacket = ({
  userKey,
  type,
  meta,
  payload,
}) => {
  const apiType = fromTypeToApi(type);
  const packet = JSON.stringify({
    type: apiType,
    userKey,
    meta: meta || {},
    payload,
  });
  return packet;
};

export default function sendMessage(ws) {
  return params => {
    if (getStore.connected) {
      const packet = getPacket(params);
      ws.send(packet);
    } else {
      dispatch({
        type: `${params.type}_REJECTED`,
        data: {
          message: 'There was an error communicating with the server.',
        },
      });
    }
  };
}
