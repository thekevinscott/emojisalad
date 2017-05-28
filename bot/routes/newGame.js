//const Promise = require('bluebird');
//const Player = require('models/player');
//const User = require('models/user');
const _ = require('lodash');
const sendMessages = require('../lib/sendMessages');
const Message = require('models/message');

import getService from 'lib/getService';

import parse, {
  RESPOND
} from 'lib/parse';

module.exports = (req, res) => {
  const game = req.body;
  const player = game.players[0];
  console.info('new game!', game);
  res.json({});
  return parse([{
    type: RESPOND,
    params: {
      message: {
        key: 'new-game',
        options: {
          nickname: player.nickname,
          avatar: player.avatar,
        },
      },
      player,
    }
  }]).then(messages => {
    return Message.parse(messages, {});
  }).then(sendMessages);
};

