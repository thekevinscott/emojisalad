import pushcity from 'pushcity';

import {
  PUSHCITY_API_KEY,
} from '../../../config';

import {
  getStore,
} from '../../utils/storage';

import {
  SUBMIT_CLAIM,
} from '../../modules/Register/types';

getStore().then(initialState => {
  if (initialState && initialState.data && initialState.data.me && initialState.data.me.key) {
    console.log('register with pushcity', initialState.data.me.key, PUSHCITY_API_KEY);
    pushcity.register({
      userID: initialState.data.me.key,
      apiKey: PUSHCITY_API_KEY,
    });
  }
});

export default function storageMiddleware() {
  return next => action => {
    if (action.type === `${SUBMIT_CLAIM}_FULFILLED`) {
      const {
        key,
      } = action.data;

      console.log('register with pushcity', key, PUSHCITY_API_KEY);
      pushcity.register({
        userID: key,
        apiKey: PUSHCITY_API_KEY,
      });
    }

    return next(action);
  };
}
