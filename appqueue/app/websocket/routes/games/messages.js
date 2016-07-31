import fetchMessagesForGames from '../../messages/fetchMessagesForGames';

export default function fetchMessages(ws, { userKey, gameKey, messageKeysToExclude }) {
  if (! userKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a user key');
    });
  } else if (! gameKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a game key');
    });
  }

  return fetchMessagesForGames(userKey, [gameKey], messageKeysToExclude).then(messagesByGames => {
    console.log('**** got here');
    return {
      key: gameKey,
      messages: messagesByGames[gameKey],
    };
  });
}

