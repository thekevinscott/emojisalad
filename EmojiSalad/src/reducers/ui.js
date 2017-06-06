import {
  combineReducers,
} from 'redux';

import App from 'app/components/App/reducer';
import Authentication from 'app/components/Authentication/reducer';
import Register from 'app/pages/Register/reducer';
import Games from 'app/pages/Games/reducer';
import Game from 'app/pages/Game/reducer';
import Settings from 'app/pages/Settings/reducer';
import GameDetails from 'app/pages/GameDetails/reducer';
import NewGame from 'app/pages/NewGame/reducer';
import Invite from 'app/pages/Invite/reducer';

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
