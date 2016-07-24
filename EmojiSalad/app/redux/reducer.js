import {
  combineReducers,
} from 'redux';

import Register from '../modules/Register/reducer';
import App from '../modules/App/reducer';
import Games from '../modules/Games/reducer';
import Game from '../modules/Game/reducer';

import games from '../reducers/games';
import messages from '../reducers/messages';
import players from '../reducers/players';
import users from '../reducers/users';
import me from '../reducers/me';

export default combineReducers({
  ui: combineReducers({
    Register,
    App,
    Games,
    Game,
  }),
  data: combineReducers({
    games,
    messages,
    players,
    users,
    me,
  }),
});
