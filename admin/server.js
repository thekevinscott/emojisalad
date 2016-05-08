'use strict';
// set require path
require('app-module-path').addPath(__dirname);

const fetch = require('isomorphic-fetch');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const SOCKET_PORT = process.env.SOCKET_PORT || 5101;
server.listen(SOCKET_PORT);

const registry = require('microservice-registry');
registry.register('admin',{
  services: ['api']
});

app.use(express.static(__dirname + '/public'));

// set up handlebars
const exphbs = require('express-handlebars');
app.engine('.html', exphbs({
  extname: '.html'
}));
app.set('view engine', '.ejs');

// middleware
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const expressSession = require('express-session');
app.use(expressSession({secret: 'ssdffdsfsfsfsffo $$$!!!!#@@@ fodis230eorwdfiklj3wkjerdf'}));

// set up passport authentication strategies
require('./api/passport')(app);
app.set('port', (process.env.PORT || 5001));

registry.ready(() => {
  app.listen(app.get('port'), () => {
    console.log("Node app is running at localhost:" + app.get('port'));
  });
});

// routes
require('./api/routes/account')(app);
require('./api/routes/logs')(app, io);
//require('./api/routes/players')(app);
//require('./api/routes/messages')(app);
//require('./api/routes/games')(app);
//require('./api/routes/scores')(app);
//require('./api/routes/phrases')(app);

app.get('/api/games', (req, res) => {
  getFetch('games', 'get', res);
});
app.get('/api/games/:game_id', (req, res) => {
  getFetch(`games/${req.params.game_id}`, 'get', res);
});
app.get('/api/users', (req, res) => {
  getFetch(`users/`, 'get', res);
});
app.get('/api/users/:user_id', (req, res) => {
  getFetch(`users/${req.params.user_id}`, 'get', res);
});
app.get('/api/phrases', (req, res) => {
  getFetch(`phrases/`, 'get', res);
});
app.post('/api/phrases', (req, res) => {
  getFetch(`phrases/`, 'post', res, req.body);
});

// bootstrap our web app
app.get('*', (req, res) => {
  res.render('app', { SOCKET_PORT });
});

const getFetch = (route, method, res, body) => {
  const manifest = registry.get('api').api;
  const endpoint = manifest.games.get.endpoint.substring(0, 22);
  route = `${endpoint}${route}`;

  fetch(route, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => {
    return response.json();
  }).then((response) => {
    res.json(response);
  }).catch((err) => {
    res.json({ err: err.message });
  });
};
