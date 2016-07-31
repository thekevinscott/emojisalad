import fetchMessages from './fetchMessages';

export function getWhereParameters(userKey, gameKey, messageKeysToExclude) {
  const whereParams = {
    'game_key=?': gameKey,
    'user_key=?': userKey,
  };
  if (messageKeysToExclude) {
    //console.log(messageKeysToExclude);
    return {
      ...whereParams,
      '`key` NOT IN ?': messageKeysToExclude,
    };
  }

  return whereParams;
}

export default function fetchMessagesForGames(userKey, gameKeys, messageKeysToExclude) {
  return Promise.all(gameKeys.map(gameKey => {
    return fetchMessages(getWhereParameters(
      userKey,
      gameKey,
      messageKeysToExclude
    )).then(messages => ({
      [gameKey]: messages,
    }));
  })).then(messages => {
    return messages.reduce((obj, gameMessages) => ({
      ...obj,
      ...gameMessages,
    }), {});
  });
}
