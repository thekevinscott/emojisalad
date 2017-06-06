/* globals Promise */
import {
  KEY,
  PERSIST_DATA,
} from 'src/config';

import {
  AsyncStorage,
} from 'react-native';

let initialState;

export default function getStore() {
  if (!PERSIST_DATA) {
    return new Promise(resolve => resolve({}));
  } else if (initialState) {
    return new Promise(resolve => resolve(initialState));
  }

  return AsyncStorage.getItem(KEY).then(savedStorage => {
    try {
      return JSON.parse(savedStorage || '{}');
    } catch (err) {
      console.error('There was an error parsing JSON', savedStorage);
      throw new Error(err);
    }
  }).then(state => {
    initialState = state;
    return state;
  });
}
