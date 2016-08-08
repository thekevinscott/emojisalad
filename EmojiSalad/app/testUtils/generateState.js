jest.unmock('faker');
jest.unmock('moment');
jest.unmock('./getFixture');

import faker from 'faker';
import getFixture from './getFixture';

function incrementTime(obj, key, index = 0) {
  const timestamp = Number(obj[key]) * 1000;
  const variation = 1000 * 5 * index; // 5 seconds
  return {
    ...obj,
    [key]: timestamp - variation,
  };
}

function translateTimestamp(obj, index) {
  if (obj.created) {
    return incrementTime(obj, 'created', index);
  }

  return incrementTime(obj, 'timestamp', index);
}

function generateType(type, amount = 3, payload) {
  const keys = [];
  for (let i = 0; i < amount; i++) {
    keys.push(faker.random.uuid());
  }
  return keys.map((key, index) => {
    const obj = getFixture(type, {
      key,
    });

    return translateTimestamp({
      ...obj,
      ...(payload || [])[index],
    }, index);
  });
}

export default function generateState() {
  const gamesAmount = 3;
  const messagesPerGame = 5;
  const users = generateType('user', gamesAmount + 3);
  const allMessages = generateType('message', gamesAmount * messagesPerGame).map(message => ({
    ...message,
  }));

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
