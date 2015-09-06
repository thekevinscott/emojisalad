// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5003;
var newMessage = require('./newMessage');
var addUser = require('./addUser');

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

server.listen(port, function () {
  console.log('EmojinaryFriend Messenger listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.get('/:username', function(req, res) {
    res.render('index', { username: req.params.username });

});

io.on('connection', function (socket) {
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function(data) {
    newMessage(socket, data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function(data) {
    addUser(socket, data);
  });
});
