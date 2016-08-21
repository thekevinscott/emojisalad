import claim from './routes/users/claim';
import fetchGames from './routes/games/fetch';
import fetchMessages from './routes/games/messages';
import receiveMessage from './routes/messages/receive';
import setDeviceInfo from './routes/devices/setDeviceInfo';
import setDeviceToken from './routes/devices/setDeviceToken';

export const CLAIM = 'CLAIM';
export const FETCH_GAMES = 'FETCH_GAMES';
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_DEVICE_INFO = 'SEND_DEVICE_INFO';
export const SEND_DEVICE_TOKEN = 'SEND_DEVICE_TOKEN';

const ROUTES = {
  [CLAIM]: claim,
  [FETCH_GAMES]: fetchGames,
  [FETCH_MESSAGES]: fetchMessages,
  [SEND_MESSAGE]: receiveMessage,
  [SEND_DEVICE_INFO]: setDeviceInfo,
  [SEND_DEVICE_TOKEN]: setDeviceToken,
};

export default ROUTES;
