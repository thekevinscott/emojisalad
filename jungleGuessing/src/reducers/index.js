import { combineReducers } from 'redux';
import messages from './messages';
import phrases from './phrases';
import user from './user';

const rootReducer = combineReducers({
  messages,
  phrases,
  user,
});

export default rootReducer;
