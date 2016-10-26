import {
  combineReducers,
} from 'redux';

import games from './games';
import users from './users';
import messages from './messages';
import pendingMessages from './pendingMessages';
import me from './me';

export default combineReducers({
  me,
  messages,
  pendingMessages,
  games,
  users,
});
