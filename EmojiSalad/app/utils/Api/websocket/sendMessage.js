import {
  Alert,
} from 'react-native';

import {
  getType,
} from './translate';

export default function sendMessage(websocket) {
  return (type, payload) => {
    console.log('socket sending time');
    if (websocket.get('isOpen')) {
      console.log('send the socket', payload);
      const packet = JSON.stringify({
        type: getType(type),
        payload,
      });
      console.log(packet);
      websocket.get('websocket').send(packet);
    } else {
      Alert.alert(
        'Websocket is not connected',
        'Wruh wroh, your message was thrown in the trash.'
      );
    }
  };
}
