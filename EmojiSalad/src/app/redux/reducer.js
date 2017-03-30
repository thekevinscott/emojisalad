import {
  combineReducers,
} from 'redux';

import App from 'app/components/App/reducer';
import Register from 'app/pages/Register/reducer';
import Games from 'app/pages/Games/reducer';
import Game from 'app/pages/Game/reducer';
import Logger from 'app/components/Logger/reducer';

import data from 'app/reducers/data';

import application from 'app/reducers/application';

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
