import {
  combineReducers,
} from 'redux';

import Games from 'pages/Games/reducer';
import Game from 'pages/Game/reducer';
import Settings from 'pages/Settings/reducer';
import GameDetails from 'pages/GameDetails/reducer';
import NewGame from 'pages/NewGame/reducer';
import Invite from 'pages/Invite/reducer';

export default combineReducers({
  Games,
  Game,
  GameDetails,
  Settings,
  NewGame,
  Invite,
});
