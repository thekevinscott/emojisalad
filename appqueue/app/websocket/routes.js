import claim from './users/claim';
import fetchGames from './games/fetch';

export const CLAIM = 'CLAIM';
export const FETCH_GAMES = 'FETCH_GAMES';

const ROUTES = {
  [CLAIM]: claim,
  [FETCH_GAMES]: fetchGames,
};

export default ROUTES;
