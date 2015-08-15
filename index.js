var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5001));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.get('/', function (req, res) {
    res.send('Hello to admin world');
});

app.listen(app.get('port'), function() {
    console.log('Example app listening on port', app.get('port'));
});
