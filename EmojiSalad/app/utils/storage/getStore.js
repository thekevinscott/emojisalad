const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
  PERSIST_DATA,
} from '../../../config';

export default function getStore() {
  if (!PERSIST_DATA) {
    return new Promise(resolve => resolve({}));
  }

  return AsyncStorage.getItem(KEY).then(savedStorage => {
    try {
      return JSON.parse(savedStorage || '{}');
    } catch (err) {
      console.error('There was an error parsing JSON', savedStorage);
      throw new Error(err);
    }
  });
}
