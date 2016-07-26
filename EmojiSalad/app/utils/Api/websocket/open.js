//import {
  //Alert,
//} from 'react-native';

export default function open(websocketClass, callback) {
  return () => {
    console.log('web socket connection live');
    websocketClass.set('isOpen', true);
    callback();
    // connection opened
  };
}
