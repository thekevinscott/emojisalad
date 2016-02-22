'use strict';
const _ = require('lodash');
const Promise = require('bluebird');
const Player = require('models/player');
const Round = require('models/round');
const Invite = require('models/invite');
const User = require('models/user');
const Game = require('models/game');
const Emoji = require('models/emoji');
const rule = require('config/rule');
//const kickoffGame = require('../shared/kickoffGame');

module.exports = (user, input) => {
  console.info('start thr game');
  return Invite.get({
    invited_id: user.id
  }).then((invites) => {
    console.info('invites');
    return new Promise((resolve) => {
      if ( invites.length && invites[0].game ) {
        console.info('add to game');
        resolve(Game.add(invites[0].game, [user]));
      } else {
        console.info('create game');
        resolve(Game.create([user]));
      }
    }).then((game) => {
      console.info('game is back', game);
      // now, our "user" now is a "player"; that means they
      // are assigned to a game and have a particular game number
      // associated with them.
      const player = game.players.filter((game_player) => {
        return game_player.user_id === user.id;
      }).pop();

      console.info('the player', player);

      if ( game.players.length === 1 ) {
        console.info('there is one player in this game');
        // this is brand new game; invite some people
        return [{
          player: player,
          key: 'intro_4',
          options: [player.nickname, player.avatar]
        }];
      } else if ( game.round_count > 0 ) {
        console.info('there are multiple players in this game. game is in progress!');
        const invite = invites[0];
        const inviter = invite.inviter_player;
        const invited = player; // just a renaming, to make this clearer

        //console.log('GAME PLAYERS', game.players.length);
        return game.players.map((player) => {
          let message;

          if ( player.id === invited.id ) {
            message = {
              key: 'accepted-inviter',
              options: [invited.nickname, invited.avatar, inviter.nickname, inviter.avatar]
            };
          } else if ( player.id === inviter.id ) {
            message = {
              key: 'accepted-invited', options: [invited.nickname, invited.avatar],
            };
          } else {
            message = {
              key: 'join-game', options: [invited.nickname, invited.avatar],
            };
          }
          return _.assign({
            player: player
          }, message);
        });
      } else {
        console.info('create a new round, and start the game!');
        const invite = invites[0];
        const inviter = invite.inviter_player;
        const invited = player; // just a renaming, to make this clearer

        console.info('invite', invite);
        console.info('invited', invited);
        console.info('inviter', inviter);
        return Round.create(game).then((round) => {
          console.info('round', round);
          // start the game
          return [
            { key: 'accepted-invited', options: [invited.nickname, invited.avatar], player: inviter },
            { key: 'accepted-inviter', options: [invited.nickname, invited.avatar, inviter.nickname, inviter.avatar], player: invited },
            { key: 'game-start', options: [round.submitter.nickname, round.submitter.avatar, round.phrase], player: round.submitter },
          ];
        });
      }
    });
  });
};
