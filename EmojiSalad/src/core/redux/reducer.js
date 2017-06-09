import {
  combineReducers,
} from 'redux';

import ui from 'reducers/ui';

import data from 'reducers/data';

import application from 'reducers/application';

export default combineReducers({
  ui,
  data,
  application,
});
