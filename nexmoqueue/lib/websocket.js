let io;

module.exports = server => {
  if (server) {
    io = require('socket.io').listen(server);
  }

  return io;
}
