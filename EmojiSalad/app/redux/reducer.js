import {
  combineReducers,
} from 'redux';

import Register from '../modules/Register/reducer';
import App from '../modules/App/reducer';
import Games from '../modules/Games/reducer';
import Game from '../modules/Game/reducer';
import Logger from '../components/Logger/reducer';

import data from '../reducers/data';

import application from '../reducers/application';

export default combineReducers({
  ui: combineReducers({
    Register,
    App,
    Games,
    Game,
    Logger,
  }),
  data,
  application,
});
