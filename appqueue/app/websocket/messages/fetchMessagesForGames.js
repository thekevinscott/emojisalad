import fetchMessages from './fetchMessages';

export function getWhereParameters(userKey, gameKey, before) {
  const whereParams = {
    'game_key=?': gameKey,
    'user_key=?': userKey,
  };
  if (before) {
    console.log(before);
    const beforeQuery = ` (timestamp < (SELECT UNIX_TIMESTAMP(created) FROM sent WHERE \`key\` = '${before}')
        OR timestamp < (SELECT UNIX_TIMESTAMP(created) FROM received WHERE \`key\` = '${before}'))`;
    return {
      ...whereParams,
      [beforeQuery]: '',
    };
  }

  return whereParams;
}

export default function fetchMessagesForGames(userKey, gameKeys, options = {}) {
  return Promise.all(gameKeys.map(gameKey => {
    return fetchMessages(getWhereParameters(
      userKey,
      gameKey,
      options.before
    ), options.limit).then(messages => ({
      [gameKey]: messages,
    }));
  })).then(messages => {
    return messages.reduce((obj, gameMessages) => ({
      ...obj,
      ...gameMessages,
    }), {});
  }).catch(err => {
    console.error('some error', err);
  });
}
