// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let routes = [];
function addRoute(path, fn_path) {
  routes.push({
    regex: new RegExp(path),
    fn: Promise.method(require(fn_path)),
    path: fn_path
  });
}
addRoute('uncreated', './players/create');
addRoute('waiting-for-confirmation', './players/confirm');
addRoute('waiting-for-nickname', './players/nickname');
addRoute('waiting-for-invites', './players/invite');
addRoute('do-not-contact', './players/blackhole');
addRoute('waiting-for-submission', './games/submission');
addRoute('ready-for-game', './players/say');
addRoute('submitted', './players/submitted');
addRoute('guessing', './games/guess');
addRoute('bench', './players/say');
addRoute('waiting-for-round', './players/say');
addRoute('passed', './players/say');
addRoute('lost', './players/say');

let Router = function(player, message, game_number, debug) {
  let state = player.state;
  if ( player.blacklist ) {
    if ( debug ) {
      console.log('route: blackhole');
    }
    return Promise.method(require('./players/blackhole'))(player, message, game_number);
  }
  for ( let i=0,l=routes.length; i<l; i++ ) {
    let route = routes[i];
    if ( route.regex.test(state) ) {
      Player.logLastActivity(player, game_number);
      //console.log('player', player.state, player.number, game_number);
      if ( debug ) {
        console.log('route: '+route.path);
      }
      return route.fn(player, message, game_number);
      //break;
    }
  }
  throw new Error('state not found: ' + state + ", player: " + player.id);
};

module.exports = Router;
