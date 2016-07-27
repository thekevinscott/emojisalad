//import {
  //Alert,
//} from 'react-native';

export default function open(websocket, callback) {
  return () => {
    console.log('web socket connection live');
    websocket.isOpen = true;
    callback();
    // connection opened
  };
}
