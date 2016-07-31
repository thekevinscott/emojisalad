const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
  RESET,
} from './config';

export default function getStore() {
  return AsyncStorage.getItem(KEY).then(savedStorage => {
    if (RESET) {
      return {};
    }
    return JSON.parse(savedStorage || '{}');
  });
}
