import {
  combineReducers,
} from 'redux';

import router from './router';
import connection from './connection';
import authentication from './authentication';

export default combineReducers({
  router,
  connection,
  authentication,
});
