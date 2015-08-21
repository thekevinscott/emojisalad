var express = require('express');
var app = express();
var db = require('db');

app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5003");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/test', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json({ success: 1 });
});

/*
app.get('/goat/:number', function(req, res) {
  var msg = 'Are you ready to get GOATED???\n\nPlease reply yes or no';
  var to = req.params.number;
  //var to = '8604608183';
  text.send(to, {
    msg: msg,
    //url: 'http://thumbs.media.smithsonianmag.com//filer/b9/d2/b9d271f3-7f66-4132-b5af-7d33844505b7/goat.jpg__800x600_q85_crop.jpg'
  }).then(function(message) {
    res.json(message);
  }).fail(function(err) {
    res.json(err);
  });
});
*/

// this creates a new game
app.put('/users/:user_id', require('./routes/users/update'));
app.get('/users/:user_id/games', require('./routes/users/games'));
app.get('/users/:user_id/games', require('./routes/users/games'));
app.post('/invites/new', require('./routes/invites/create'));

// this handles all replies
app.post('/platform/:platform', require('./platforms/'));

app.listen(app.get('port'), function() {
  console.log('EmojinaryFriend API');
  //console.log('listening on port', app.get('port'), 'with db', db.environment);
});
