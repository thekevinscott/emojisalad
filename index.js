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
    res.send('hello1');
});

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
    /*
     * ToCountry: 'US',
     * ToState: 'CT',
     * SmsMessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
     * NumMedia: '0',
     * ToCity: 'GALES FERRY',
     * FromZip: '06357',
     * SmsSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
     * FromState: 'CT',
     * SmsStatus: 'received',
     * FromCity: 'NEW LONDON',
     * Body: 'yes',
     * FromCountry: 'US',
     * To: '+18603814348',
     * NumSegments: '1',
     * ToZip: '06382',
     * MessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
     * AccountSid: 'ACf2076b907d44abdd8dc8d262ff941ee4',
     * From: '+18604608183',
     * ApiVersion: '2010-04-01'
     */
    var body = req.body.Body;
    var from = req.body.From;
    var msg;
    if ( body === 'yes' ) {
        msg = 'Sweet! Here come the goats!'
    } else if ( body === 'no' ) {
        msg = 'You responded no. Tough shit! Here they come.'
    } else {
        msg = 'You responded '+body+'. You suck. Why can\'t you just follow simple instructions? You\'re getting goated anyways.';
    }
    response(text.reply([
        msg
    ]), res);

    var count = 0;
    [
        'https://40.media.tumblr.com/d1c5775702dc6189a73b49e8b6d7dd50/tumblr_nsyxozGxXd1ux3mxuo1_400.jpg',
        'https://40.media.tumblr.com/bc412787d41eec40458da569d12f3b0f/tumblr_mvhbs7xuU61sqd69vo1_500.jpg',
        'http://shame-full.com/wp-content/uploads/2013/03/8747zkkeh32wnx2p_D_0_655-funny-lama.jpg',
    ].map(function(img) {
        count++;
        setTimeout(function() {
            text.send(from, {
                url: img
            });
        }, 500 * count);
    });
});

function response(twiml, res) {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

app.listen(app.get('port'), function() {
    console.log('Example app listening on port', app.get('port'));
});
