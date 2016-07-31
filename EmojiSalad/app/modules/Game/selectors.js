import {
  selectMe,
} from '../App/selectors';

import {
  fetchMessages,
  incrementPage,
  updateCompose,
  sendMessage,
} from './actions';

function sortByNewestFirst(a, b) {
  return new Date(b.timestamp) - new Date(a.timestamp);
}
//function sortByNewest(a, b) {
  //return new Date(a.timestamp) - new Date(b.timestamp);
//}

export const makeSelectMessages = () => {
  const messagesPerPage = 19;
  return (game, messages, page, sentMessages = 0) => {
    return game.messages.map(key => {
      return {
        key,
        ...messages[key],
      };
    }).sort(sortByNewestFirst).slice(0, messagesPerPage * page + sentMessages);
  };
};

function selectCompose(state, gameKey) {
  return state.ui.Game.compose[gameKey];
}

export function makeMapStateToProps() {
  const selectMessages = makeSelectMessages();
  return (state, props) => {
    const gameKey = props.game.key;
    const game = state.data.games[gameKey];
    const {
      pages,
      sentMessages,
    } = state.ui.Game;
    const messages = selectMessages(game, state.data.messages, pages[gameKey], sentMessages[gameKey]);

    console.log('the messages', messages.length);

    return {
      game,
      messages,
      me: selectMe(state),
      compose: selectCompose(state, game.key),
    };
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

