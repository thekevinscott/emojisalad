'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
//const Phone = require('models/phone');
//const Round = require('models/round');
const Emoji = require('models/emoji');
//const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  if ( rule('invite').test(message) ) {
    console.log('game invite');
    return require('./invite')(player, message);
  } else if ( rule('clue').test(message) ) {
    console.log('game clue');
    return require('./clue')(player, message);
  } else if ( rule('new-game').test(message) ) {
    console.log('game new game');
    const user = { id: player.user_id, to: player.to };
    return require('./new_game')(user);
  } else if ( rule('help').test(message) ) {
    console.log('game help');
    return require('./help')(player, message);
  } else {
    console.log('game else', player);
    return Game.get({ player_id: player.id }).then((games) => {
      const game = games[0];
      console.log('got game', game);

      if ( game.round ) {
        console.log('game round exists');
        if ( player.id !== game.round.submitter.id ) {
          console.log('gameguess', player, message);
          return require('./guess')(game, player, message);
        } else {
          console.log('game round else');
          if ( rule('pass').test(message) ) {
            console.log('game round pass');
            return require('./pass')(game, player, message);
          } else {
            if ( ! game.round.submission ) {
              console.log('game round no submission');
              // listen for an emoji submission
              return Emoji.checkInput(message).then((result) => {
                if ( result.type === 'emoji' || result.type === 'mixed' ) {
                  return require('./submission')(game, player, message);
                } else {
                  return require('./say')(game, player, message);
                }
              });
            } else {
              console.log('game round say');
              return require('./say')(game, player, message);
            }
          }
        }
      } else {
        return [{
          player,
          key: 'invited-chilling'
        }];
        /*
        return Phone.parse(message).then((result) => {
          if ( result && result.phone ) {
            console.log('1');
            return require('./invite')(player, message);
            //console.log('phones', phones);
          } else {
            // see if the input is a valid phone number
            console.log('game round chillind');
            return [{
              player,
              key: 'invited-chilling'
            }];
          }
        });
        */
      }
    });
  }
};
