import SocketIO from 'socket.io';
//import WS from 'ws';
import receiveMessage from './receiveMessage';
import sendMessage from './sendMessage';
import postChecks from './postChecks';
import {
  setClient,
} from './connections';
import parseMessage from './parseMessage';

//import url from 'url';
//const WebSocketServer = WS.Server;

//const routes = require('./routes');
//const getMessages = require('../utils/getMessages');
export default function bootstrapWebsocket(server) {
  console.info('bootstrap websocket');
  const io = new SocketIO(server);
  //const wss = new WebSocketServer({ server });
  io.on('connection', socket => {
    //console.info('made a new connection');

    socket.on('message', json => {
      //console.log(new Date(), 'we got a message');
      return parseMessage(json).then(message => {
        const startTime = new Date();
        console.info('received a message', message, startTime);
        // save the websocket connection locally,
        // keyed off of the user key, so we can
        // send and receive messages
        setClient(socket, message);

        // process the particular route based
        // off of the incoming type
        receiveMessage(socket, message).then(sendMessage(socket, startTime)).catch(sendMessage(socket, startTime));

        // check for presence of device info and device
        // token; if non existent, send out requests
        // for that info
        postChecks(socket, message);
      });
    });
  });
}
