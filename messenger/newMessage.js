var reqwest = require('reqwest');

function newMessage (socket, data) {
  reqwest({
    url: 'http://localhost:5000/platform/messenger',
    method: 'POST',
    data: data
  }).then(function(data) {
    if ( data && data.message ) {
      socket.emit('response', {
        message: data.message
      });
    }
  }).catch(function(e) {
    console.log('e', e);
  });
}

module.exports = newMessage;
