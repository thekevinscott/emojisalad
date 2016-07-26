export default function error() {
  return e => {
    // an error occurred
    console.log('an error from web socket', e.message);
  };
}
