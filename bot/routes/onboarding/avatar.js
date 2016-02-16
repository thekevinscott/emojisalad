'use strict';
const _ = require('lodash');
const Promise = require('bluebird');
const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const Game = require('models/game');
const Emoji = require('models/emoji');
const rule = require('config/rule');
//const kickoffGame = require('../shared/kickoffGame');

module.exports = (user, input) => {
  const to = user.to;
  return new Promise((resolve, reject) => {
    if ( rule('keep').test(input) ) {
      resolve(User.update(user, {
        confirmed_avatar: 1
      }));
    } else {
      return Emoji.checkInput(input, { emoji: input }).then((result) => {
        if ( result.type === 'emoji' && result.number === 1 ) {
          // also check length of emoji
          const to = user.to;
          resolve(User.update(user, {
            avatar: input,
            confirmed_avatar: 1
          }));
        } else {
          reject('error-14');
        }
      });
    }
  }).then((user) => {
    return Invite.get({
      invited_id: user.id
    }).then((invites) => {
      return new Promise((resolve) => {
        if ( invites.length && invites[0].game ) {
          resolve(Game.add(invites[0].game, [user]));
        } else {
          resolve(Game.create([user]));
        }
      }).then((game) => {
        // now, our "user" now is a "player"; that means they
        // are assigned to a game and have a particular game number
        // associated with them.
        const player = game.players.filter((game_player) => {
          return game_player.user_id === user.id;
        }).pop();

        if ( game.players.length === 1 ) {
          // this is brand new game; invite some people
          return [{
            player: player,
            key: 'intro_4',
            options: [player.nickname, player.avatar]
          }];
        } else if ( game.rounds.length > 0 ) {
          // this is a game in progress
          throw "TBD";
        } else {
          const invite = invites[0];
          const inviter = invite.inviter_player;
          const invited = player; // just a renaming, to make this clearer
          console.log('THIS IS WHEN WE START TEH GAME; MAYBE POST TO A ROUND?');
          // start the game
          return [
            { key: 'accepted-invited', options: [invited.nickname], player: inviter },
            { key: 'accepted-inviter', options: [invited.nickname, inviter.nickname], player: invited },
            { key: 'game-start', options: [inviter.nickname, 'FOO'], player: inviter },
          ];
        }
      });
    });
  }).catch((err) => {
    console.debug('7');
    console.debug('err', err);
    return [{
      player: user,
      key: 'error-14'
    }];
  });
};
