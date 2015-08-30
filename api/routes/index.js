// a separate router. all routes come in to platforms which then routes them here.

var Promise = require('bluebird');
var script = require('../scripts');
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
addRoute('do-not-call', require('./users/blackhole'));
addRoute('waiting-for-submission', require('./games/submission'));
addRoute('ready-for-game', require('./users/say'));
addRoute('submitted', require('./users/say'));
addRoute('guessing', require('./games/guess'));

var Router = function(user, message) {
  var state = user.state;
  for ( var i=0,l=routes.length; i<l; i++ ) {
    var route = routes[i];
    if ( route.regex.test(state) ) {
      console.log('state', state, user.id);
      return route.fn(user, message);
      break;
    }
  }
  console.log('state not found', state, user.id);
}

module.exports = Router;
