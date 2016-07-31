import fetchMessages from './fetchMessages';

export default function fetchMessagesForGames(gameKeys) {
  return Promise.all(gameKeys.map(gameKey => {
    return fetchMessages({
      'game_key=?': gameKey,
    }).then(messages => ({
      [gameKey]: messages,
    }));
  })).then(messages => {
    return messages.reduce((obj, gameMessages) => ({
      ...obj,
      ...gameMessages,
    }), {});
  });
}
