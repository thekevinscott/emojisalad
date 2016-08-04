export default function error(websocket) {
  return e => {
    // an error occurred
    websocket.log('an error from web socket', e.message);
  };
}
