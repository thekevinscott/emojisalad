import io from 'socket.io-client';
import {
  RECEIVED_MESSAGE,
} from './types';

let d;
const socket = io('http://nexmo.emojisalad.com');

socket.on('message', (data) => {
  //console.log(data);
  d({
    type: RECEIVED_MESSAGE,
    data,
  });
});

export default function websocketMiddleware({
  dispatch,
}) {
  d = dispatch;
  return next => action => {
    return next(action);
  };
}

