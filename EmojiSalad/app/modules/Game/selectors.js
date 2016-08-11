import {
  selectMe,
} from '../App/selectors';

import {
  fetchMessages,
  updateCompose,
  sendMessage,
} from './actions';

import {
  sortBy,
} from '../../utils/sort';

export const MESSAGES_PER_PAGE = 20;

export function selectMessages(game, messages, firstRead) {
  const sortedMessages = game.messages.map(key => ({
    key,
    ...messages[key],
  }))
  .sort(sortBy('newestFirst', a => a.timestamp));

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
  } = state.ui.Game[gameKey] || {};

  const messages = selectMessages(game, state.data.messages, (seen || {}).first);

  return {
    game,
    messages,
    me: selectMe(state),
    compose: selectCompose(state, game.key),
    logger: state.ui.Games.logger,
    seen,
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
    },
  };
}
