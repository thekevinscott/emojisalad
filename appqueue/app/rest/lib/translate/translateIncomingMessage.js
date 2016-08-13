import translateIncomingData from './translateIncomingData';

export default function translateIncomingMessage(message) {
  //console.info('translate in 1');
  return translateIncomingData(message).then(({
    userKey,
    gameKey,
  }) => {
    console.info('incoming data translated', userKey, gameKey);
    const payload = {
      body: message.body,
      initiated_id: message.initiated_id || null,
      userKey,
      gameKey,
    };
    console.info('returning payload', payload);
    return payload;
  });
}
