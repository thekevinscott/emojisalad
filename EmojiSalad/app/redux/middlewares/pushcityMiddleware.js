import pushcity from 'pushcity';

import {
  PUSHCITY_API_KEY,
} from 'config';

import {
  getStore,
} from 'app/utils/storage';

import {
  SUBMIT_CLAIM,
} from 'app/pages/Register/types';

getStore().then(initialState => {
  if (initialState && initialState.data && initialState.data.me && initialState.data.me.key) {
    pushcity.register({
      userID: initialState.data.me.key,
      apiKey: PUSHCITY_API_KEY,
    }).then(params => {
      console.log('**** pushcity 2', params);
    });
  }
});

export default function storageMiddleware() {
  return next => action => {
    if (action.type === `${SUBMIT_CLAIM}_FULFILLED`) {
      const {
        key,
      } = action.data;

      pushcity.register({
        userID: key,
        apiKey: PUSHCITY_API_KEY,
      });
    }

    return next(action);
  };
}
