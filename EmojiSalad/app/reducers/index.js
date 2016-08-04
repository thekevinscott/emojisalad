import {
  combineReducers,
} from 'redux';

import games from './games';
import users from './users';
import messages from './messages';
import me from './me';

export router from './router';

export default combineReducers({
  me,
  messages,
  games,
  users,
});
