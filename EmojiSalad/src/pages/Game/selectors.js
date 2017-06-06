import {
  selectMe,
} from 'components/App/selectors';

import {
  fetchMessages,
  updateCompose,
  sendMessage,
} from './actions';

import {
  sortBy,
} from 'utils/sort';

export const MESSAGES_PER_PAGE = 20;

const selectArrayFromState = (messages = {}, keys = []) => {
  return keys.map(key => ({
    key,
    ...messages[key],
  }));
};

export const makeNameFromPlayers = (players = []) => players.map(({
  name,
  nickname,
}) => {
  return nickname || name || '';
}).map(name => name.split(' ').shift()).filter(n => n).join(', ');

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

const selectGame = ({ data }, gameKey) => {
  if (data.games[gameKey]) {
    const game = data.games[gameKey];

    const players = game.players.map(userKey => {
      return data.users[userKey];
    });

    const invites = game.invites.map(inviteKey => {
      return data.invites[inviteKey];
    });

    return {
      ...game,
      name: game.name || makeNameFromPlayers(players),
      players,
      invites,
    };
  }

  return {};
};

export function mapStateToProps(state, props) {
  //console.log(props.game, state.data.games);
  const gameKey = props.game.key;
  const game = selectGame(state, gameKey);
  const {
    seen,
    loading,
    updated,
  } = state.ui.Game[gameKey] || {};

  const messages = selectMessages(
    game,
    state.data.messages,
    state.data.pendingMessages,
    (seen || {}).first
  );

  const compose = selectCompose(state, game.key);

  const loggerMessages = state.ui.Logger.messages;

  const me = selectMe(state);
  return {
    game,
    messages,
    me,
    logger: loggerMessages,
    compose,
    seen,
    loading,
    updated,
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
