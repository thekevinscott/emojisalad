import WS from 'ws';
import receiveMessage from './receiveMessage';
import sendMessage from './sendMessage';
//import url from 'url';
const WebSocketServer = WS.Server;
//const routes = require('./routes');
//const getMessages = require('../utils/getMessages');
export default function bootstrapWebsocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    //const location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', message => {
      console.log('clients', wss.clients.length);
      receiveMessage(ws, message).then(sendMessage(ws)).catch(sendMessage(ws));
    });
  });
}
