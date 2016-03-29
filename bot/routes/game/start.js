'use strict';
const _ = require('lodash');
const Promise = require('bluebird');
//const Player = require('models/player');
const Round = require('models/round');
const Invite = require('models/invite');
//const User = require('models/user');
const Game = require('models/game');
//const Emoji = require('models/emoji');
//const rule = require('config/rule');

module.exports = (user) => {
  console.info('start the game route');
  return Invite.get({
    invited_id: user.id,
    used: 0
  }).then((invites) => {
    console.info('invites');
    return new Promise((resolve) => {
      if ( invites.length && invites[0].game ) {
        console.info('add to game');
        return Game.add(invites[0].game, [user]).then((game) => {
          //console.info('USE INVITE 2');
          return Invite.use(_.assign({ game_id: game.id },invites[0])).then(() => {
            resolve(game);
          });
        });
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

      if ( ! player ) {
        console.error('error: no player found for game: ', game);
        throw new Error('No player found for game');
      }

      if ( game.players.length === 1 ) {
        console.info('there is one player in this game');
        // this is brand new game; invite some people
        return [{
          player,
          key: 'intro_4',
          options: [player.nickname, player.avatar]
        }];
      } else if ( game.round_count > 0 ) {
        console.info('there are multiple players in this game. game is in progress!');
        const invite = invites[0];
        if ( game.round.submission ) {
          // round is in progress
          return getInviteAcceptedMessages(game, invite, player, 'accepted-inviter-in-progress').concat([{
            key: 'emojis',
            options: [game.round.submitter.nickname, game.round.submitter.avatar, game.round.submission],
            player
          },
          {
            key: 'guessing-instructions',
            options: [],
            player
          }]);
        } else {
          // round has yet to begin
          return getInviteAcceptedMessages(game, invite, player, 'accepted-inviter');
        }

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
            { key: 'game-start', options: [round.submitter.nickname, round.submitter.avatar, round.phrase], player: round.submitter }
          ];
        });
      }
    });
  });
};

const getInviteAcceptedMessages = (game, invite, player, invited_key) => {
  const inviter = invite.inviter_player;
  const invited = player; // just a renaming, to make this clearer

  return game.players.map((player) => {
    let message;

    if ( player.id === invited.id ) {
      message = {
        key: invited_key,
        options: [invited.nickname, invited.avatar, inviter.nickname, inviter.avatar]
      };
    } else if ( player.id === inviter.id ) {
      message = {
        key: 'accepted-invited', options: [invited.nickname, invited.avatar]
      };
    } else {
      message = {
        key: 'join-game', options: [invited.nickname, invited.avatar]
      };
    }
    return _.assign({
      player
    }, message);
  });
};
