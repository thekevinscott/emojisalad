const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
} from './config';

export default function getStore() {
  return AsyncStorage.getItem(KEY).then(savedStorage => {
    //return {};
    return JSON.parse(savedStorage || '{}');
  });
}
