// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5003;

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

require('./routes')(app);

io.on('connection', function (socket) {
  var newMessage = require('./newMessage');
  socket.on('new message', function(data) {
    newMessage(socket, data);
  });
});

server.listen(port, function () {
  console.log('EmojinaryFriend Messenger listening at port %d', port);
});
