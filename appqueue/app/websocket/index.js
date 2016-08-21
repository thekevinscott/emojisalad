import WS from 'ws';
import receiveMessage from './receiveMessage';
import sendMessage from './sendMessage';
import postChecks from './postChecks';
import {
  setClient,
} from './connections';
import parseMessage from './parseMessage';

//import url from 'url';
const WebSocketServer = WS.Server;

export const HANDSHAKE = 'HANDSHAKE';

const sendHandshake = ws => {
  sendMessage(ws)({
    type: HANDSHAKE,
    data: {
      date: (new Date()).getTime(),
    },
  });
};
//const routes = require('./routes');
//const getMessages = require('../utils/getMessages');
export default function bootstrapWebsocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', ws => {
    console.info(new Date(), 'we made connection');
    //const location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    sendHandshake(ws);

    ws.on('message', json => {
      console.log(new Date(), 'we got a message');
      return parseMessage(json).then(message => {
        console.info('received a message', message);
        // save the websocket connection locally,
        // keyed off of the user key, so we can
        // send and receive messages
        setClient(ws, message);

        // process the particular route based
        // off of the incoming type
        receiveMessage(ws, message).then(sendMessage(ws)).catch(sendMessage(ws));

        // check for presence of device info and device
        // token; if non existent, send out requests
        // for that info
        postChecks(ws, message);
      });
    });
  });
}
