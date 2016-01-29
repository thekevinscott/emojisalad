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
  return Player.getOne({
    from: from,
    to: to
  }).then((player) => {
    if ( player ) {
      // this means we are in a game
    } else {
      return User.getOne({
        from: from
      }).then((user) => {
        // if user exists, we are being onboarded
        if ( user ) {
          if ( ! user.confirmed ) {
            return require('./users/confirm')(user, message, to);
          }
          player = {
            state: 'uncreated',
            user_id: user.id,
            to: to,
            //number: user.from,
            user: user
          };
        } else {
          return require('./users/create')(from, message, to);
        }
      });
    }
  });
};

module.exports = Router;
