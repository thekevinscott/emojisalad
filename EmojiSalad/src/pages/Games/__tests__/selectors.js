jest.unmock('../selectors');
jest.unmock('faker');
jest.unmock('moment');
//jest.unmock('react-test-renderer');
jest.unmock('../../../testUtils/daysAgo');
jest.unmock('../../../testUtils/getFixture');
jest.unmock('../../../testUtils/generateState');
jest.unmock('../../../testUtils/getState');

import faker from 'faker';

//import renderer from 'react-test-renderer';
import daysAgo from '../../../testUtils/daysAgo';
import getFixture from '../../../testUtils/getFixture';
import getState from '../../../testUtils/getState';

import {
  selectUser,
  selectPlayers,
  getLastMessage,
  selectMessages,
  selectGames,
  selectGamesByNewestFirst,
} from '../selectors';

describe('Games selectors', () => {
  describe('selectUser', () => {
    it('should select a specific user', () => {
      const name = faker.name.findName();
      const stateObj = {
        data: {
          users: {
            userOne: {
              name,
            },
          },
        },
      };
      expect(selectUser(stateObj, 'userOne')).toEqual({
        name,
      });
    });
  });

  describe('selectPlayers', () => {
    it('should select users as players from the state', () => {
      const userOne = {
        name: faker.name.findName(),
      };
      const userTwo = {
        name: faker.name.findName(),
      };
      const userThree = {
        name: faker.name.findName(),
      };

      const stateObj = {
        data: {
          users: {
            userOne,
            userTwo,
            userThree,
          },
        },
      };

      const userKeys = [
        'userOne',
        'userThree',
      ];

      expect(selectPlayers(stateObj, userKeys)).toEqual([
        userOne,
        userThree,
      ]);
    });
  });

  describe('getLastMessage', () => {
    it('should select the last message in a game', () => {
      const timestamp = daysAgo(2) * 1000;
      const message = getFixture('message', {
        timestamp,
      });
      const game = {
        messages: [
          message,
        ],
      };

      expect(getLastMessage(game)).toEqual(timestamp);
    });
  });

  describe('selectMessages', () => {
    it('should return an array of messages for a game', () => {
      const messageKeys = [
        'foo',
        'bar',
        'baz',
      ];

      const stateObj = {
        data: {
          messages: messageKeys.map(key => {
            return getFixture('message', {
              key,
            });
          }),
        },
      };

      const result = selectMessages(stateObj, ['foo', 'baz']);
      expect(result[0]).toEqual(stateObj.data.messages.foo);
      expect(result[1]).toEqual(stateObj.data.messages.baz);
      expect(Object.keys(result)).not.toContain('bar');
    });

    it('should return a sorted array of messages', getState(state => {
      const messageKeys = Object.keys(state.data.messages).slice(0, 3);

      state.data.messages[messageKeys[0]].timestamp = Number(daysAgo(2)) * 1000;
      state.data.messages[messageKeys[1]].timestamp = Number(daysAgo(1)) * 1000;
      state.data.messages[messageKeys[2]].timestamp = Number(daysAgo(3)) * 1000;

      const result = selectMessages(state, messageKeys);
      expect(result[0]).toEqual(state.data.messages[messageKeys[2]]);
      expect(result[1]).toEqual(state.data.messages[messageKeys[0]]);
      expect(result[2]).toEqual(state.data.messages[messageKeys[1]]);
    }));
  });

  describe('selectGames', () => {
    it('should return an array of games', getState(state => {
      const result = selectGames(state);
      expect(result.length).toEqual(3);
      result.forEach(game => {
        expect(Object.keys(game.players[0])).toContain('nickname');
        expect(Object.keys(game.messages[0])).toContain('body');
      });
    }));

    /*
    it('should return an array of games by most recent message timestamp', getState(state => {
      const gamesArray = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const newMessages = [
        getFixture('message', {
          timestamp: daysAgo(3),
        }),
        getFixture('message', {
          timestamp: daysAgo(1),
        }),
        getFixture('message', {
          timestamp: daysAgo(2),
        }),
      ];

      newMessages.forEach((message, index) => {
        gamesArray[index].messages.push(message.key);
        state.data.messages[message.key] = message;
      });

      const result = selectGames(state);
      expect(result[0].key).toEqual(gamesArray[0].key);
      expect(result[1].key).toEqual(gamesArray[2].key);
      expect(result[2].key).toEqual(gamesArray[1].key);
    }));
    */
  });

  describe('selectGamesByNewestFirst', () => {
    it.only('should return a sorted array of games with unread indicators', () => {
      const gamesArray = [
        getFixture('game', {
          lastRead: 'foo',
        }),
        getFixture('game', {
          lastRead: 'none',
        }),
      ];

      const newMessages = [
        getFixture('message', {
          key: 'foo',
          timestamp: daysAgo(3),
        }),
        getFixture('message', {
          key: 'bar',
          timestamp: daysAgo(1),
        }),
      ];

      newMessages.forEach((message, index) => {
        gamesArray[index].messages.push(message.key);
      });

      const result = selectGamesByNewestFirst({
        data: {
          games,
        },
      });

      expect(result[0].key).toEqual(gamesArray[1].key);
      expect(result[1].key).toEqual(gamesArray[0].key);

      expect(result[0].isUnread).toEqual(false);
      expect(result[1].isUnread).toEqual(true);
    });
  });
});
