const React = require('react-native');
const {
  AsyncStorage,
} = React;

import {
  KEY,
} from './config';

// TODO: Fix this import
import getStore2 from './getStore';

let storing = false;
let nextStore = null;

export function setStore(item) {
  if (!storing) {
    storing = true;
    AsyncStorage.setItem(KEY, item).then(result => {
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

import reducers from './reducers';
export const WHITELISTED_REDUCERS = reducers;

export const getStore = getStore2;
