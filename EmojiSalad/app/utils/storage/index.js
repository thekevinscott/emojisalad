const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
} from './config';

// TODO: Fix this import
export getStore from './getStore';

let storing = false;
let nextStore = null;

export function setStore(item) {
  if (!storing) {
    storing = true;
    AsyncStorage.setItem(KEY, item).then(() => {
      storing = false;
      if (nextStore) {
        setStore(nextStore);
        nextStore = null;
      }
    });
  } else {
    // put the store request in a queue
    // if there's already one in the queue, it gets tossed
    // in lieue of this new one.
    nextStore = item;
  }
}

import reducers from './whitelisted';
export const WHITELISTED_REDUCERS = reducers;

export getStateParts from './getStateParts';
//export const getStateParts = _getStateParts;
