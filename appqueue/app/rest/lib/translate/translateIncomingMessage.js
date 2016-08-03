import translateIncomingData from './translateIncomingData';

export default function translateIncomingMessage(message) {
  console.info('translate in 1');
  return translateIncomingData(message).then(({
    userKey,
    gameKey,
  }) => ({
    body: message.body,
    initiated_id: message.initiated_id || null,
    userKey,
    gameKey,
  }));
}
