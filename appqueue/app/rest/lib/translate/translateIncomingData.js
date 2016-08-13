import fetchUserKey from './fetchUserKey';
import fetchGameKey from './fetchGameKey';

import {
  getIncomingCache,
  setIncomingCache,
} from './cache';

function newPromise(payload) {
  return new Promise(resolve => resolve(payload));
}

export default function translateIncomingData(message) {
  const phoneNumber = message.to;
  const senderId = message.from;

  const cachedValue = getIncomingCache(phoneNumber, senderId);
  if (cachedValue) {
    console.info('entry exists in incoming cache', phoneNumber, senderId);
    return newPromise({
      ...cachedValue,
    });
  }

  console.log('incoming 1');
  return fetchUserKey(phoneNumber).then(userKey => {
    console.log('incoming 2', userKey);
    if (message.game_key) {
      return {
        userKey,
        gameKey: message.game_key,
      };
    }

    return fetchGameKey(userKey, senderId).then(gameKey => {
      console.log('incoming 3', gameKey);
      console.info('got the values', userKey, gameKey);
      return {
        userKey,
        gameKey,
      };
    });
  }).then(({
    userKey,
    gameKey,
  }) => {
    return {
      ...setIncomingCache(phoneNumber, senderId, {
        userKey,
        gameKey,
      }),
    };
  });
}
