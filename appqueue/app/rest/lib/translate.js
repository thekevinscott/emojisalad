import fetchPhoneNumber from './fetchPhoneNumber';
import fetchPlayerTo from './fetchPlayerTo';

const users = {};

function translateData({
  user_key: userKey,
  game_key: gameKey,
}) {
  if (users[userKey] && users[userKey][gameKey]) {
    console.log('entry exists in cache', userKey, gameKey);
    const {
    } = users[userKey][gameKey];
    return new Promise(resolve => resolve({
      ...users[userKey][gameKey],
    }));
  }

  console.log('entry does not exist in cache', userKey, gameKey);
  // else, we need to go fetch that data
  return Promise.all([
    fetchPhoneNumber(userKey),
    fetchPlayerTo(userKey, gameKey),
  ]).then(([phoneNumber, senderId]) => {
    console.log('got the values', phoneNumber, senderId);
    if (!phoneNumber) {
      throw new Error(`No phone number found for user key ${userKey} and ${gameKey}`);
    }
    if (!senderId) {
      throw new Error(`No sender Id found for user key ${userKey} and ${gameKey}`);
    }
    if (!users[userKey]) {
      users[userKey] = {};
    }
    users[userKey][gameKey] = {
      phoneNumber,
      senderId,
    };
    return {
      ...users[userKey][gameKey],
    };
  });
}

export function translateOutgoingMessage(message) {
  return translateData(message).then(({ phoneNumber, senderId }) => ({
    id: message.id,
    body: message.body,
    timestamp: (new Date(message.timestamp)).getTime() / 1000,
    from: phoneNumber, // the user's phone number
    to: senderId, // the ID of the original SMS game_number assigned to the player
  }));
}
