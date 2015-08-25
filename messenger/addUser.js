var rp = require('request-promise');

function addUser (socket, username) {
  // we store the username in the socket session for this client
  socket.username = username;
  socket.emit('login');
  // this could go get a list of messages
  setTimeout(function() {
    socket.emit('response', {
      message: 'YES'
    });
  }, 1000);
}

module.exports = addUser;
