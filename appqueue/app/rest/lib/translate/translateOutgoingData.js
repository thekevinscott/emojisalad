/*
 * This function translates a message in the received
 * table into something consumable by bot.
 *
 * It does this by populating the phone number,
 * and the to field.
 *
 */
import fetchPhoneNumber from './fetchPhoneNumber';
import fetchPlayerTo from './fetchPlayerTo';

import {
  getOutgoingCache,
  setOutgoingCache,
} from './cache';

function newPromise(payload) {
  return new Promise(resolve => resolve(payload));
}

// This function takes a user key and a game key,
// representing a message received from the app (since every
// message is attached to a particular user and game).
//
// This function will then first query the cache to see if translations
// exist for the values passed in.
//
// If nothing is present in the cache, we'll fetch the phone number
// that matches the user key, and we'll fetch the "sender id" that
// matches the atom of the user and game keys.
export default function translateOutgoingData({
  user_key: userKey,
  game_key: gameKey,
}) {
  const cachedValue = getOutgoingCache(userKey, gameKey);
  if (cachedValue) {
    console.info('entry exists in outgoing cache', userKey, gameKey);
    return newPromise({
      ...cachedValue,
    });
  }

  console.info('entry does not exist in outgoing cache', userKey, gameKey);
  // else, we need to go fetch that data
  return Promise.all([
    fetchPhoneNumber(userKey),
    fetchPlayerTo(userKey, gameKey),
  ]).then(([phoneNumber, senderId]) => {
    console.info('got the values', phoneNumber, senderId);
    return {
      ...setOutgoingCache(userKey, gameKey, {
        phoneNumber,
        senderId,
      }),
    };
  });
}
