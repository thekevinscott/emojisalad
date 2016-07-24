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

/*
console.log('ok!');
[
  'http://google.com',
  'https://google.com',
  'http://45.55.41.73:5012/test',
].map(url => {
  console.log('url', url);
  return fetch(url, {
    method: 'get',
  }).then(response => {
    console.log('success');
    console.log(url, response);
  }).catch(err => {
    console.log('error');
    console.log(url, err);
  });
});
*/
