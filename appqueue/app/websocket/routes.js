import claim from './routes/users/claim';
import fetchGames from './routes/games/fetch';
import fetchMessages from './routes/games/messages';
import receiveMessage from './routes/messages/receive';
import setDeviceInfo from './routes/devices/setDeviceInfo';
import setDeviceToken from './routes/devices/setDeviceToken';
import setDevicePushId from './routes/devices/setDevicePushId';
import startNewGame from './routes/games/start';
import invite from './routes/games/invite';
import pause from './routes/games/pause';
import leave from './routes/games/leave';

export const CLAIM = 'CLAIM';
export const FETCH_GAMES = 'FETCH_GAMES';
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_DEVICE_INFO = 'SEND_DEVICE_INFO';
export const SEND_DEVICE_PUSH_ID = 'SEND_DEVICE_PUSH_ID';
export const START_NEW_GAME = '@NewGame/START_NEW_GAME';
export const INVITE = '@Invite/INVITE';
export const LEAVE = '@Games/LEAVE_GAME';
export const PAUSE = '@Games/PAUSE_GAME';

const ROUTES = {
  [CLAIM]: claim,
  [FETCH_GAMES]: fetchGames,
  [FETCH_MESSAGES]: fetchMessages,
  [SEND_MESSAGE]: receiveMessage,
  [SEND_DEVICE_INFO]: setDeviceInfo,
  [SEND_DEVICE_PUSH_ID]: setDevicePushId,
  [START_NEW_GAME]: startNewGame,
  [INVITE]: invite,
  [PAUSE]: pause,
  [LEAVE]: leave,
};

export default ROUTES;
