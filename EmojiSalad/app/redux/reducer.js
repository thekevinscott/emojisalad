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

import * as GameContents from '../modules/Game';
const {
  reducers: gameReducersOrig,
} = GameContents.default;
const gameReducers = gameReducersOrig.default;

const mapReducers = (reducers) => {
  return Object.keys(reducers).reduce((obj, key) => ({
    ...obj,
    [key]: reducers[key],
  }), {});
};

export default {
  register,
  app,
  ...mapReducers(gamesReducers),
  ...mapReducers(gameReducers),
};
