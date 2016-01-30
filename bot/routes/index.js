// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let User = require('models/user');
let routes = [];
function addRoute(path, fn_path) {
  routes.push({
    regex: new RegExp(path),
    fn: Promise.method(require(fn_path)),
    path: fn_path
  });
}
//addRoute('waiting-for-nickname', './players/nickname');
//addRoute('waiting-for-avatar', './players/avatar');
//addRoute('waiting-for-invites', './players/invite');
//addRoute('do-not-contact', './players/blackhole');
//addRoute('waiting-for-submission', './games/submission');
//addRoute('ready-for-game', './players/say');
//addRoute('submitted', './players/submitted');
//addRoute('guessing', './games/guess');
//addRoute('bench', './players/say');
//addRoute('waiting-for-round', './players/say');
//addRoute('passed', './players/say');
//addRoute('lost', './players/say');
//addRoute('invited-to-new-game', './players/invited-to-new-game');

let Router = function(from, message, to) {
  //console.log('***** 1');
  return Player.getOne({
    from: from,
    to: to
  }).then((player) => {
    //console.log('***** 2', player);
    if ( player ) {
      //console.log('***** 3');
      // this means we are in a game
    } else {
      // this means we are either brand new,
      // or being onboarded
      return User.getOne({
        from: from
      }).then((user) => {
        // if user exists, we are being onboarded
        if ( user ) {
          // append the number the user has messaged to the user object.
          // Any valid game number will maintain the same conversation
          user.to = to;
          return require('./onboarding')(user, message);
        } else {
          return require('./create-user')(from, message, to);
        }
      });
    }
  });
};

module.exports = Router;
