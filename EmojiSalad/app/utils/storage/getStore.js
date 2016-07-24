const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
} from './config';

export default function getStore() {
  console.log('get teh store');
  return AsyncStorage.getItem(KEY).then(savedStorage => {
    return JSON.parse(savedStorage || '{}');
  });
}
