import { combineReducers } from 'redux';
import guesses from './guesses';
import phrases from './phrases';
import user from './user';

const rootReducer = combineReducers({
  guesses,
  phrases,
  user,
});

export default rootReducer;
