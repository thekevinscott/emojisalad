import translateIncomingData from './translateIncomingData';

export default function translateIncomingMessage(message) {
  return translateIncomingData(message).then(({
    userKey,
    gameKey,
  }) => {
    console.info('incoming data translated', userKey, gameKey);
    return {
      body: message.body,
      initiated_id: message.initiated_id || null,
      userKey,
      gameKey,
    };
  });
}
