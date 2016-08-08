import {
  selectMe,
} from '../App/selectors';

import {
  fetchMessages,
  incrementPage,
  updateCompose,
  sendMessage,
} from './actions';

export const MESSAGES_PER_PAGE = 20;

export function selectMessages(game, messages, page = 1, visibleMessages = 0) {
  return game.messages.map(key => ({
    key,
    ...messages[key],
  }))
  .sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  })
  .slice(0, MESSAGES_PER_PAGE * page + visibleMessages);
}

function selectCompose(state, gameKey) {
  return state.ui.Game.compose[gameKey];
}

export function makeMapStateToProps(state, props) {
  const gameKey = props.game.key;
  const game = state.data.games[gameKey];
  const {
    pages,
    sentMessages,
  } = state.ui.Game;

  const page = (pages || {})[gameKey] || 1;
  const sentMessagesPayload = sentMessages[gameKey];
  const messages = selectMessages(game, state.data.messages, page, sentMessagesPayload);

  return {
    game,
    messages,
    me: selectMe(state),
    compose: selectCompose(state, game.key),
    logger: state.ui.Games.logger,
  };
}

export function mapDispatchToProps(dispatch, props) {
  return {
    actions: {
      fetchMessages: (userKey, gameKey, messageKeysToExclude) => {
        return dispatch(fetchMessages(userKey, gameKey, messageKeysToExclude));
      },
      incrementPage: (gameKey) => {
        return dispatch(incrementPage(gameKey));
      },
      updateCompose: (text) => {
        const gameKey = props.game.key;
        return dispatch(updateCompose(gameKey, text));
      },
      sendMessage: (userKey, message) => {
        const gameKey = props.game.key;
        return dispatch(sendMessage(userKey, gameKey, message));
      },
    },
  };
}
