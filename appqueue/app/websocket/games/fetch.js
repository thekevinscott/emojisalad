import getUserGames from './getUserGames';

export default function fetchGames(ws, payload) {
  return getUserGames(payload.userKey).then(response => {
    console.log('games', response);
    return response;
  });
}
