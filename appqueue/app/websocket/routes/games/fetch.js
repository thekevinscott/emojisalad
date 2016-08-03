import getUserGames from '../../games/getUserGames';
import fetchMessagesForGames from '../../messages/fetchMessagesForGames';
import fetchTotalMessagesForGames from '../../messages/fetchTotalMessagesForGames';

export default function fetchGames(ws, { userKey }) {
  if (! userKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a user key');
    });
  }

  return getUserGames(userKey).then(games => {
    return games.map(game => ({
      key: game.key,
      created: game.created,
      players: game.players,
      //round: game.round,
      round_count: game.round_count,
    }));
  }).then(games => {
    const gameKeys = games.map(game => game.key);
    return Promise.all([
      fetchTotalMessagesForGames(userKey, gameKeys),
      fetchMessagesForGames(userKey, gameKeys),
    ]).then(response => {
      const totalMessages = response[0];
      const messages = response[1];
      return games.map(game => ({
        ...game,
        messages: messages[game.key],
        total_messages: totalMessages[game.key],
      }));
    });
  });
}
