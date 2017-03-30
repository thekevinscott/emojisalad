jest.unmock('faker');
jest.unmock('./daysAgo');

import faker from 'faker';
import daysAgo from './daysAgo';

export default function getFixture(type, payload = {}) {
  switch (type) {
  case 'message' :
    return {
      key: faker.random.uuid(),
      body: faker.lorem.sentence(),
      userKey: faker.random.uuid(),
      gameKey: faker.random.uuid(),
      timestamp: daysAgo(30),
      type: 'received',
      ...payload,
    };
  case 'game' :
    return {
      key: faker.random.uuid(),
      created: daysAgo(30),
      archived: 0,
      round_count: 0,
      players: [],
      round: getFixture('round'),
      messages: [
        getFixture('message'),
      ],
      total_messages: 1,
      ...payload,
    };
  case 'round':
    return {
      key: faker.random.uuid(),
      phrase: faker.random.word(),
      clue: faker.random.word(),
      winner: null,
      submission: null,
      created: daysAgo(30),
      ...payload,
    };
  case 'user':
    return {
      key: faker.random.uuid(),
      nickname: faker.internet.userName(),
    };
  }
}

