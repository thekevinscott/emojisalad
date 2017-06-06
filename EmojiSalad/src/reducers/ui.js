import {
  combineReducers,
} from 'redux';

import App from 'components/App/reducer';
import Authentication from 'components/Authentication/reducer';
import Register from 'pages/Register/reducer';
import Games from 'pages/Games/reducer';
import Game from 'pages/Game/reducer';
import Settings from 'pages/Settings/reducer';
import GameDetails from 'pages/GameDetails/reducer';
import NewGame from 'pages/NewGame/reducer';
import Invite from 'pages/Invite/reducer';

export default combineReducers({
  Register,
  App,
  Games,
  Game,
  GameDetails,
  Authentication,
  Settings,
  NewGame,
  Invite,
});
