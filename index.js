/* globals process, __dirname */
var express = require('express');
var app = express();

console.log('*** TODO: Lets get Node using ES6, too');

app.use(express.static(__dirname + '/public'));

// set up handlebars
var exphbs = require('express-handlebars');
app.engine('.html', exphbs({
    extname: '.html',
}));
app.set('view engine', '.html');

// middleware
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
var expressSession = require('express-session');
app.use(expressSession({secret: 'ssdffdsfsfsfsffo $$$!!!!#@@@ fodis230eorwdfiklj3wkjerdf'}));

// set up passport authentication strategies
require('./api/passport')(app);
app.set('port', (process.env.PORT || 5001));
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

// routes
require('./api/routes/account')(app);

// bootstrap our web app
app.get('/', function(req, res) {
    res.render('app.html');
});
