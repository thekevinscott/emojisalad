var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//var text = require('./text');

app.all('/test', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log('testing successful');
  res.json({ success: 1 });
});

//app.all('*', function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //next();
//});


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
app.post('/new', require('./routes/users/create'));
app.post('/users/create', require('./routes/users/create'));
app.put('/users/:user_id', require('./routes/users/update'));
app.post('/invites/new', require('./routes/invites/create'));

// this handles all replies
app.post('/platform/:platform', require('./platforms/'));

// DEPRECATED

app.post('/reply', require('./routes/reply')); // old
app.listen(app.get('port'), function() {
  console.log('Example app listening on port', app.get('port'));
});
