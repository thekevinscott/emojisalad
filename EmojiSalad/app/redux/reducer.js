import {
  combineReducers,
} from 'redux';

import App from 'app/components/App/reducer';
import Register from 'app/pages/Register/reducer';
import Games from 'app/pages/Games/reducer';
import Game from 'app/pages/Game/reducer';
import NewGame from 'app/pages/NewGame/reducer';
import Invite from 'app/pages/Invite/reducer';
import Logger from 'app/components/Logger/reducer';
import InvitePlayers from 'app/components/InvitePlayers/reducer';

import data from 'app/reducers/data';

import application from 'app/reducers/application';

export default combineReducers({
  ui: combineReducers({
    Register,
    App,
    Games,
    Game,
    Logger,
    NewGame,
    Invite,
    InvitePlayers,
  }),
  data,
  application,
});
