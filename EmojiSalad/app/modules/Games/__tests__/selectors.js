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

    fit('should return a sorted array of messages', () => {
      const messageKeys = [
        'foo',
        'bar',
        'baz',
      ];
      const messageArr = messageKeys.map(key => {
        return getFixture('message', {
          key,
        });
      }).map(msg => {
        return {
          ...msg,
          timestamp: Number(msg.timestamp) * 1000,
        };
      });

      const messages = messageArr.reduce((obj, message) => ({
        ...obj,
        [message.key]: message,
      }), {});

      console.log(messageArr);
      console.log('state data', messageArr.map(msg => {
        return {
          key: msg.key,
          body: msg.body,
          d: new Date(msg.timestamp),
        };
      }));

      messages.foo.timestamp = daysAgo(3);
      messages.bar.timestamp = daysAgo(1);
      messages.baz.timestamp = daysAgo(2);

      const result = selectMessages({
        data: {
          messages,
        },
      }, messageKeys);
      expect(result[0]).toEqual(messages.foo);
      expect(result[1]).toEqual(messages.baz);
      expect(result[2]).toEqual(messages.bar);
    });
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

    fit('should return an array of games by most recent message timestamp', getState(state => {
      const gamesArray = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const newMessages = [
        getFixture('message', {
          timestamp: daysAgo(5),
        }),
        getFixture('message', {
          timestamp: daysAgo(1),
        }),
        getFixture('message', {
          timestamp: daysAgo(3),
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
  });
});
