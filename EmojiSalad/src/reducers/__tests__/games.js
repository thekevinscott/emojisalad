jest.unmock('../data/games');
jest.unmock('../../pages/Games/types');
jest.unmock('../../pages/Game/types');
jest.unmock('moment');
jest.unmock('type-to-reducer');
jest.unmock('ramda');
jest.unmock('../../utils/translateTimestampFromDatabase');
jest.unmock('../../testUtils/getFixture');

//import faker from 'faker';

//import daysAgo from '../../testUtils/daysAgo';
import getFixture from '../../testUtils/getFixture';

import {
  FETCH_GAMES,
} from '../../pages/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from '../../pages/Game/types';

import games, {
  initialState,
} from '../data/games';

const FETCH_GAMES_FULFILLED = `${FETCH_GAMES}_FULFILLED`;
const FETCH_MESSAGES_FULFILLED = `${FETCH_MESSAGES}_FULFILLED`;
const SEND_MESSAGE_FULFILLED = `${SEND_MESSAGE}_FULFILLED`;
const RECEIVE_MESSAGE_FULFILLED = `${RECEIVE_MESSAGE}_FULFILLED`;

function getExpectedResult(type, data, payload = {}) {
  switch (type) {
  case 'game':
    return {
      [data.key]: {
        key: data.key,
        timestamp: Number(data.created) * 1000,
        archived: data.archived,
        roundCount: data.round_count,
        players: data.players,
        round: {
          key: data.round.key,
          phrase: data.round.phrase,
          clue: data.round.clue,
          winner: data.round.winner,
          submission: data.round.submission,
          timestamp: Number(data.round.created) * 1000,
        },
        messages: data.messages.map(msg => msg.key),
        totalMessages: data.total_messages,
        ...payload,
      },
    };
  }
}

describe('games reducer', () => {
  it('returns the initial state', () => {
    expect(games(undefined, {})).toEqual(initialState);
  });

  it('returns the existing state if no type is found', () => {
    expect(games(initialState, {})).toEqual(initialState);
  });

  describe('FETCH_GAMES', () => {
    it('should not populate the store if no games are received', () => {
      expect(games(initialState, {
        type: FETCH_GAMES,
        data: [],
      })).toEqual(initialState);
    });

    it('should populate the store with a hash of a received game', () => {
      const game = getFixture('game');

      expect(games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game],
      })).toEqual({
        ...getExpectedResult('game', game),
      });
    });

    it('should populate the store with a hash of two received games', () => {
      const gameOne = getFixture('game');
      const gameTwo = getFixture('game');

      expect(games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [gameOne, gameTwo],
      })).toEqual({
        ...getExpectedResult('game', gameOne),
        ...getExpectedResult('game', gameTwo),
      });
    });
  });

  describe('FETCH_MESSAGES', () => {
    it('should update the messages payload of a specific game', () => {
      const game = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game],
      });

      const messages = [
        getFixture('message'),
        getFixture('message'),
      ];

      const result = games(gameState, {
        type: FETCH_MESSAGES_FULFILLED,
        data: {
          key: game.key,
          messages,
        },
      });

      [
        game.messages[0].key,
        messages[0].key,
        messages[1].key,
      ].forEach(key => {
        expect(result[game.key].messages).toContain(key);
      });
    });

    it('should maintain the correct timestamp translation', () => {
      const game = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game],
      });

      expect(gameState[game.key].timestamp).toEqual(game.created * 1000);

      const messages = [
        getFixture('message'),
        getFixture('message'),
      ];

      const result = games(gameState, {
        type: FETCH_MESSAGES_FULFILLED,
        data: {
          key: game.key,
          messages,
        },
      });

      expect(result[game.key].timestamp).toEqual(game.created * 1000);
    });

    it('should only update messages payload with unique messages', () => {
      const game = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game],
      });

      const messages = [
        getFixture('message'),
        getFixture('message', {
          key: game.messages[0].key,
        }),
      ];

      const result = games(gameState, {
        type: FETCH_MESSAGES_FULFILLED,
        data: {
          key: game.key,
          messages,
        },
      });

      expect(result[game.key].messages.length).toEqual(2);

      [
        game.messages[0].key,
        messages[0].key,
      ].forEach(key => {
        expect(result[game.key].messages).toContain(key);
      });
    });

    it('should update messages of specific game keys', () => {
      const gameOne = getFixture('game');
      const gameTwo = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [gameOne, gameTwo],
      });

      [
        gameOne,
        gameTwo,
      ].forEach((game, index) => {
        const data = {
          key: game.key,
          messages: [
            getFixture('message'),
          ],
        };

        const result = games(gameState, {
          type: FETCH_MESSAGES_FULFILLED,
          data,
        });

        const notGame = (index === 0) ? gameTwo : gameOne;

        expect(result[game.key].messages).toContain(game.messages[0].key);
        expect(result[game.key].messages).toContain(data.messages[0].key);
        expect(result[notGame.key].messages).not.toContain(data.messages[0].key);
      });
    });
  });

  describe('SEND_MESSAGE', () => {
    it('should update the messages payload when sending a message', () => {
      const game = getFixture('game');
      const gameTwo = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game, gameTwo],
      });


      const data = getFixture('message', {
        gameKey: game.key,
      });

      const result = games(gameState, {
        type: SEND_MESSAGE_FULFILLED,
        data,
      });


      expect(result[game.key].messages).toContain(data.key);
      expect(result[gameTwo.key].messages).not.toContain(data.key);
      expect(result[game.key].totalMessages).toEqual(game.total_messages + 1);
      expect(result[gameTwo.key].totalMessages).toEqual(gameTwo.total_messages);
    });
  });

  describe('RECEIVE_MESSAGE', () => {
    it('should update the messages payload when receiving a message', () => {
      const game = getFixture('game');
      const gameTwo = getFixture('game');

      const gameState = games(initialState, {
        type: FETCH_GAMES_FULFILLED,
        data: [game, gameTwo],
      });

      const data = getFixture('message', {
        gameKey: game.key,
      });

      const result = games(gameState, {
        type: RECEIVE_MESSAGE_FULFILLED,
        data,
      });

      expect(result[game.key].messages).toContain(data.key);
      expect(result[gameTwo.key].messages).not.toContain(data.key);
      expect(result[game.key].totalMessages).toEqual(game.total_messages + 1);
      expect(result[gameTwo.key].totalMessages).toEqual(gameTwo.total_messages);
    });
  });
});
