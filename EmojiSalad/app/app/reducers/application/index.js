import {
  combineReducers,
} from 'redux';

import router from './router';
import connection from './connection';

export default combineReducers({
  router,
  connection,
});

