const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
  PERSIST_DATA,
} from '../../../config';

export default function getStore() {
  return AsyncStorage.getItem(KEY).then(savedStorage => {
    if (!PERSIST_DATA) {
      return {};
    }
    return JSON.parse(savedStorage || '{}');
  });
}
