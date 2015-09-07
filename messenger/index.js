// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5003;
var newMessage = require('./newMessage');
var addUser = require('./addUser');
var db = require('db');
var squel = require('squel');

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

server.listen(port, function () {
  console.log('EmojinaryFriend Messenger listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.get('/:user_id', function(req, res) {
  var attributes = squel
                   .select()
                   .field('a.attribute as username')
                   .field('a.user_id')
                   .from('user_attributes','a')
                   .left_join('user_attribute_keys','k','a.attribute_id=k.id')
                   .where('k.`key`=?','nickname');

  var query = squel
              .select()
              .field('u.id')
              .field('a.username')
              .from('users','u')
              .left_join(attributes, 'a', 'a.user_id=u.id')
              .where('u.id=?',req.params.user_id);

              console.log(query.toString());

    return db.query(query.toString()).then(function(users) {
      var user = users[0];
      console.log(users);
      res.render('index', { user_id: user.id, username: user.username });
    });

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
