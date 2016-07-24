import RegisterContents from '../modules/Register';
const {
  reducer: register,
} = RegisterContents;

import AppContents from '../modules/App';
const {
  reducer: app,
} = AppContents;

import * as GamesContents from '../modules/Games';
const {
  reducers: gamesReducersOrig,
} = GamesContents.default;
const gamesReducers = gamesReducersOrig.default;

export default {
  register,
  app,
  ...Object.keys(gamesReducers).reduce((obj, key) => ({
    ...obj,
    [key]: gamesReducers[key],
  }), {}),
};
