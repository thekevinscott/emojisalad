var rp = require('request-promise');

function newMessage (socket, data) {
  socket.username = data.username;

  console.log('sending message', data.message);
  rp({
    url: 'http://localhost:5000/platform/messenger',
    method: 'POST',
    json: data
  }).then(function(data) {
    if ( data && data.message ) {
      socket.emit('response', {
        message: data.message
      });
    }
    console.log('response!', data);
  }).catch(function(e) {
    console.log('e', e);
  });
}

module.exports = newMessage;
