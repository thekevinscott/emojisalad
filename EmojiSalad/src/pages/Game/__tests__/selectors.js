/* globals jest */
jest.unmock('../selectors');
jest.unmock('../actions');
jest.unmock('../../../components/App/selectors');
jest.unmock('faker');
jest.unmock('moment');
jest.unmock('../../../testUtils/daysAgo');
jest.unmock('../../../testUtils/getFixture');
jest.unmock('../../../testUtils/generateState');
jest.unmock('../../../testUtils/getState');

import getFixture from '../../../testUtils/getFixture';
import getState from '../../../testUtils/getState';

import {
  MESSAGES_PER_PAGE,
  selectMessages,
} from '../selectors';

describe('Game selectors', () => {
  describe('selectMessages', () => {
    it('should select messages for a game', getState(state => {
      const games = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const messageNum = games[0].messages.length;

      const result = selectMessages(games[0], state.data.messages);
      expect(result.length).toEqual(messageNum);
      result.forEach(message => {
        expect(games[0].messages).toContain(message.key);
      });
    }));

    it('should not select messages not attached to a game', getState(state => {
      const games = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const result = selectMessages(games[1], state.data.messages);
      result.forEach(message => {
        expect(games[0].messages).not.toContain(message.key);
      });
    }));

    it('should select messages in sorted order', getState(state => {
      const games = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const messagesArr = games[0].messages.map(key => {
        return state.data.messages[key];
      });

      messagesArr[0].timestamp = 5000;
      messagesArr[1].timestamp = 1000;
      messagesArr[2].timestamp = 3000;
      messagesArr[3].timestamp = 9000;
      messagesArr[4].timestamp = 6000;

      state.data.messages = messagesArr.reduce((obj, message) => ({
        ...obj,
        [message.key]: message,
      }), {});

      const result = selectMessages(games[0], state.data.messages);

      expect(messagesArr[0]).toEqual(result[2]);
      expect(messagesArr[1]).toEqual(result[0]);
      expect(messagesArr[2]).toEqual(result[1]);
      expect(messagesArr[3]).toEqual(result[4]);
      expect(messagesArr[4]).toEqual(result[3]);
    }));

    it('should select the n most recent messages', getState(state => {
      const visibleMessages = 10;

      const games = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      for (let i = 0; i < (MESSAGES_PER_PAGE + visibleMessages) - 5; i++) {
        const message = getFixture('message');
        games[0].messages.push(message.key);
        state.data.messages[message.key] = message;
      }

      const result = selectMessages(games[0], state.data.messages, 1, visibleMessages);
      expect(result.length).toEqual(MESSAGES_PER_PAGE + visibleMessages);
    }));

    it('should only select the max number of messages that exist if more are specified', getState(state => {
      const games = Object.keys(state.data.games).map(key => {
        return state.data.games[key];
      });

      const visibleMessages = 10;

      const result = selectMessages(games[0], state.data.messages, 1, visibleMessages);
      expect(result.length).toEqual(games[0].messages.length);
    }));
  });
});
