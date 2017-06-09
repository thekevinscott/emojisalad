import {
  combineReducers,
} from 'redux';

import Games from 'pages/Games/reducer';
import Game from 'pages/Game/reducer';
import Settings from 'pages/Settings/reducer';
import GameSettings from 'pages/GameSettings/reducer';
import Invite from 'pages/Invite/reducer';

export default combineReducers({
  Games,
  Game,
  GameSettings,
  Settings,
  Invite,
});
