let io;

module.exports = server => {
  io = require('socket.io').listen(server);
  io.on('connection', (socket) => {
    socket.emit('state', 'fooey');
  });
}
