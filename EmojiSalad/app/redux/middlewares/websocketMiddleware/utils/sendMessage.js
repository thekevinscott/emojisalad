import {
  fromTypeToApi,
} from '../translate';

const messages = [];

const TIMEOUT_LENGTH = 5000;

const getMessageId = () => {
  const messageId = messages.length;
  messages[messageId] = null;
  return messageId;
};

const getPacket = ({
  userKey,
  type,
  meta,
  payload,
}) => {
  const apiType = fromTypeToApi(type);
  return {
    type: apiType,
    userKey,
    meta: {
      ...meta,
      id: getMessageId(),
    },
    payload,
  };
};

const sendMessage = (socket, payload, error) => {
  const packet = getPacket(payload);
  messages[packet.meta.id] = setTimeout(() => {
    error(packet);
  }, TIMEOUT_LENGTH);
  socket.send(JSON.stringify(packet), () => {
    clearTimeout(messages[packet.meta.id]);
  });
  return packet;
};

export const clearTimer = (id) => {
  clearTimeout(messages[id]);
};

export default sendMessage;
