// a separate router. all routes come in to platforms which then routes them here.
'use strict';

var Promise = require('bluebird');
var User = require('models/user');
var routes = [];
function addRoute(path, fn) {
  routes.push({
    regex: new RegExp(path),
    fn: Promise.method(fn)
  });
}
addRoute('uncreated', require('./users/create'));
addRoute('waiting-for-confirmation', require('./users/confirm'));
addRoute('waiting-for-nickname', require('./users/nickname'));
addRoute('waiting-for-invites', require('./users/invite'));
addRoute('do-not-contact', require('./users/blackhole'));
addRoute('waiting-for-submission', require('./games/submission'));
addRoute('ready-for-game', require('./users/say'));
addRoute('submitted', require('./users/submitted'));
addRoute('guessing', require('./games/guess'));
addRoute('bench', require('./users/say'));
addRoute('waiting-for-round', require('./users/say'));
addRoute('passed', require('./users/say'));
addRoute('lost', require('./users/say'));

var Router = function(user, message, game_number) {
  var state = user.state;
  for ( var i=0,l=routes.length; i<l; i++ ) {
    let route = routes[i];
    if ( route.regex.test(state) ) {
      User.logLastActivity(user, game_number);
      return route.fn(user, message, game_number);
      //break;
    }
  }
  throw new Error('state not found: ' + state + ", user: " + user.id);
};

module.exports = Router;
