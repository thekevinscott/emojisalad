var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var text = require('./text');

app.get('/', function (req, res) {
    var msg = 'Are you ready to get GOATED???\n\nPlease reply yes or no';
    var to = '8604608183';
    text.send(to, {
        msg: msg,
        //url: 'http://thumbs.media.smithsonianmag.com//filer/b9/d2/b9d271f3-7f66-4132-b5af-7d33844505b7/goat.jpg__800x600_q85_crop.jpg'
    }).then(function(message) {
        res.json(message);
    }).fail(function(err) {
        res.json(err);
    });
});

app.get('/messages/:sid', function (req, res) {
    text.get(req.params.sid).then(function(message) {
        res.json(message);
    }).fail(function(err) {
        res.json(err);
    });
});

app.get('/messages', function(req, res) {
    text.get().then(function(messages) {
        res.json(messages);
    }).fail(function(err) {
        res.json(err);
    });
});

app.post('/reply', function(req, res) {
    console.log('reply');
    console.log('req body', req.body);
    response(text.reply([
        'msg1',
    ]), res);
});

function response(twiml, res) {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

app.listen(app.get('port'), function() {
    console.log('Example app listening on port', app.get('port'));
});
