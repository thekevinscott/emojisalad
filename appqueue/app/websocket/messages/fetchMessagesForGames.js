import fetchMessages from './fetchMessages';

function getBeforeOrAfterQuery(direction, key) {
  const modifier = (direction === 'before') ? '<' : '>';
  return ` (timestamp ${modifier} (SELECT UNIX_TIMESTAMP(created) FROM sent WHERE \`key\` = '${key}')
  OR timestamp ${modifier} (SELECT UNIX_TIMESTAMP(created) FROM received WHERE \`key\` = '${key}'))`;
}

function getBeforeOrAfter(options) {
  if (options.before) {
    return getBeforeOrAfterQuery('before', options.before);
  }
  return getBeforeOrAfterQuery('after', options.since);
}

export function getWhereParameters(userKey, gameKey, options = {}) {
  const whereParams = {
    'game_key=?': gameKey,
    'user_key=?': userKey,
  };

  if (options.before || options.since) {
    return {
      ...whereParams,
      [getBeforeOrAfter(options)]: '',
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
