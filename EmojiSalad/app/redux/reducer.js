import {
  combineReducers,
} from 'redux';

import ui from 'app/reducers/ui';

import data from 'app/reducers/data';

import application from 'app/reducers/application';

export default combineReducers({
  ui,
  data,
  application,
});
