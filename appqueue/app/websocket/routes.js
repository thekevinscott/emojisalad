import claim from './routes/users/claim';
import fetchGames from './routes/games/fetch';

export const CLAIM = 'CLAIM';
export const FETCH_GAMES = 'FETCH_GAMES';

const ROUTES = {
  [CLAIM]: claim,
  [FETCH_GAMES]: fetchGames,
};

export default ROUTES;
