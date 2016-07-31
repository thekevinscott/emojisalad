import getUserGames from './getUserGames';
import fetchMessagesForGames from '../messages/fetchMessagesForGames';

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
      round: game.round,
      round_count: game.round_count,
    }));
  }).then(games => {
    return fetchMessagesForGames(games.map(game => game.key)).then(messages => {
      return games.map(game => ({
        ...game,
        messages: messages[game.key],
      }));
    });
  });
}
