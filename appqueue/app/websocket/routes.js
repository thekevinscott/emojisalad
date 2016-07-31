import claim from './routes/users/claim';
import fetchGames from './routes/games/fetch';
import fetchMessages from './routes/games/messages';
import sendMessage from './routes/messages/send';

export const CLAIM = 'CLAIM';
export const FETCH_GAMES = 'FETCH_GAMES';
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';

const ROUTES = {
  [CLAIM]: claim,
  [FETCH_GAMES]: fetchGames,
  [FETCH_MESSAGES]: fetchMessages,
  [SEND_MESSAGE]: sendMessage,
};

export default ROUTES;
