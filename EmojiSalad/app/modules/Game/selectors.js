import {
  selectMe,
} from '../App/selectors';

import {
  update as updateLogger,
} from '../../components/Logger/actions';

import {
  fetchMessages,
  updateCompose,
  sendMessage,
} from './actions';

import {
  sortBy,
} from '../../utils/sort';

export const MESSAGES_PER_PAGE = 20;

const selectArrayFromState = (messages = {}, keys = []) => {
  return keys.map(key => ({
    key,
    ...messages[key],
  }));
};

export function selectMessages(game, messages, pendingMessages, firstRead) {
  const selectedMessages = selectArrayFromState(messages, game.messages);
  const selectedPendingMessages = selectArrayFromState(pendingMessages, game.pendingMessages);

  const sortedMessages = selectedMessages.concat(selectedPendingMessages).sort(sortBy('newestFirst', a => a.timestamp));

  const indexFirstRead = sortedMessages.map(msg => msg.key).indexOf(firstRead);
  return sortedMessages.slice(indexFirstRead).reverse();
}

function selectCompose(state, gameKey) {
  return (state.ui.Game[gameKey] || {}).compose;
}

export function mapStateToProps(state, props) {
  const gameKey = props.game.key;
  const game = state.data.games[gameKey];
  const {
    seen,
    isLoadingEarlier,
  } = state.ui.Game[gameKey] || {};

  const messages = selectMessages(
    game,
    state.data.messages,
    state.data.pendingMessages,
    (seen || {}).first
  );

  const compose = selectCompose(state, game.key);

  const loggerMessages = state.ui.Logger.messages;

  return {
    game,
    messages,
    me: selectMe(state),
    logger: loggerMessages.slice(loggerMessages.length - 1 - 5),
    compose,
    seen,
    isLoadingEarlier,
  };
}

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: {
      fetchMessagesBeforeFirst: (userKey, gameKey, props = {}) => {
        return dispatch(fetchMessages(userKey, gameKey, {
          before: props.seen.first,
        }));
      },
      fetchLatestMessages: (userKey, gameKey, props = {}) => {
        const {
          messages,
          seen,
        } = props;


        if (messages.length < MESSAGES_PER_PAGE) {
          return dispatch(fetchMessages(userKey, gameKey));
        }

        return dispatch(fetchMessages(userKey, gameKey, {
          since: seen.last,
        }));
      },
      updateCompose: (text) => {
        const gameKey = ownProps.game.key;
        return dispatch(updateCompose(gameKey, text));
      },
      sendMessage: (userKey, message) => {
        const gameKey = ownProps.game.key;
        return dispatch(sendMessage(userKey, gameKey, message));
      },
      updateLogger: msg => {
        return dispatch(updateLogger(msg));
      },
    },
  };
}
