var express = require('express');
var app = express();

var text = require('./text');

app.get('/', function (req, res) {
    text.send('8604608183', 'heyo').then(function(message) {
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

app.get('/response', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    twiml.say('This is msg 1');
    twiml.say('This is msg 2');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

});

var server = app.listen(5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
