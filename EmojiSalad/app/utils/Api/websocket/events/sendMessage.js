import {
  dispatch,
  getStore,
} from '../utils/store';

import checker from '../utils/checker';

import {
  fromApiToType,
  fromTypeToApi,
} from '../translate';

import {
  setPendingAction,
} from '../utils/timer';

let ws;

const messages = [];

const getMessageId = () => {
  const messageId = messages.length;
  messages.push(messageId);
  return messageId;
};

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
    meta: {
      ...meta,
      id: getMessageId(),
    },
    payload,
  });
  return packet;
};

const sendPacket = payload => {
  return getStore().then(connected => {
    if (connected) {
      const packet = getPacket(payload);
      ws.send(packet);
      const type = fromApiToType(payload.type);
      setPendingAction(type, packet, dispatch);
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
