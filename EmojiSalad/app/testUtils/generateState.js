jest.unmock('faker');
jest.unmock('moment');
jest.unmock('./getFixture');

import faker from 'faker';
import getFixture from './getFixture';

function generateType(type, amount = 3, payload) {
  const keys = [];
  for (let i = 0; i < amount; i++) {
    keys.push(faker.random.uuid());
  }
  return keys.map((key, index) => {
    const obj = getFixture(type, {
      key,
    });
    return {
      ...obj,
      timestamp: Number(obj.created) * 1000,
      ...(payload || [])[index],
    };
  });
}

export default function generateState() {
  const gamesAmount = 3;
  const messagesPerGame = 5;
  const users = generateType('user', gamesAmount + 3);
  const allMessages = generateType('message', gamesAmount * messagesPerGame);

  const games = generateType('game', gamesAmount).reduce((obj, game, index) => {
    const start = index * messagesPerGame;
    const end = start + messagesPerGame;
    const messages = allMessages.slice(start, end).map(msg => msg.key);
    const players = users.slice(index, index + 3).map(user => user.key);
    return {
      ...obj,
      [game.key]: {
        ...game,
        players,
        messages,
        total_messages: messages.length,
      },
    };
  }, {});

  const state = {
    data: {
      games,
      messages: allMessages.reduce((obj, message) => ({
        ...obj,
        [message.key]: {
          ...message,
          gameKey: Object.keys(games).filter(gameKey => {
            const game = games[gameKey];
            return game.messages.filter(messageKey => {
              return messageKey === message.key;
            }).length > 0;
          }).pop(),
        },
      }), {}),
      users: users.reduce((obj, user) => ({
        ...obj,
        [user.key]: user,
      }), {}),
    },
  };
  return state;
}
