// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let routes = [];
function addRoute(path, fn) {
  routes.push({
    regex: new RegExp(path),
    fn: Promise.method(fn)
  });
}
addRoute('uncreated', require('./players/create'));
addRoute('waiting-for-confirmation', require('./players/confirm'));
addRoute('waiting-for-nickname', require('./players/nickname'));
addRoute('waiting-for-invites', require('./players/invite'));
addRoute('do-not-contact', require('./players/blackhole'));
addRoute('waiting-for-submission', require('./games/submission'));
addRoute('ready-for-game', require('./players/say'));
addRoute('submitted', require('./players/submitted'));
addRoute('guessing', require('./games/guess'));
addRoute('bench', require('./players/say'));
addRoute('waiting-for-round', require('./players/say'));
addRoute('passed', require('./players/say'));
addRoute('lost', require('./players/say'));

let Router = function(player, message, game_number) {
  let state = player.state;
  if ( player.blacklist ) {
    return Promise.method(require('./players/blackhole'))(player, message, game_number);
  }
  for ( let i=0,l=routes.length; i<l; i++ ) {
    let route = routes[i];
    if ( route.regex.test(state) ) {
      Player.logLastActivity(player, game_number);
      //console.log('player', player.state, player.number, game_number);
      return route.fn(player, message, game_number);
      //break;
    }
  }
  throw new Error('state not found: ' + state + ", player: " + player.id);
};

module.exports = Router;
