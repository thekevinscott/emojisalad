import {
  dispatch,
  getStore,
} from '../utils/store';

import checker from '../utils/checker';

import {
  fromTypeToApi,
} from '../translate';

let ws;

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

const sendPacket = payload => {
  return getStore().then(connected => {
    if (connected) {
      const packet = getPacket(payload);
      ws.send(packet);
    } else {
      dispatch({
        type: `${payload.type}_REJECTED`,
        data: {
          message: 'There was an error communicating with the server.',
        },
      });
    }
  });
};

const sendMessage = payload => {
  return checker({
    check: () => ws,
    success: () => {
      return ws;
    },
    failure: () => {
      return 'Could not find store in 2 seconds';
    },
  }).then(() => {
    return sendPacket(payload);
  });
};

export default sendMessage;

export const setSendMessage = _ws => {
  ws = _ws;
};
