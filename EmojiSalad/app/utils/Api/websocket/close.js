//import {
  //Alert,
//} from 'react-native';

export default function close(websocket, callback) {
  return e => {
    if (websocket.isOpen) {
      //Alert.alert(
        //'Websocket has gone away',
        //`Websocket has closed: ${e.code} ${e.reason}`,
      //);
      websocket.isOpen = false;
      // connection closed
      console.log('websocket has closed', e.code, e.reason);
    }

    callback();
  };
}
