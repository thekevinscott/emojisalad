import RegisterContents from '../modules/Register';
const {
  reducer: register,
} = RegisterContents;

import AppContents from '../modules/App';
const {
  reducer: app,
} = AppContents;

export default {
  register,
  app,
};
