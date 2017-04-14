import { bindActionCreators } from 'redux'
import {
  fetchData,
  openGame,
  updateStartingMessage,
  leaveGame,
  pauseGame,
} from './actions';

import {
  updateDeviceToken,
} from 'app/utils/pushNotificationListeners/actions';

import {
  sortBy,
} from 'utils/sort';

import {
  selectMe,
} from 'components/App/selectors';

export function selectUser(state, userKey) {
  return state.data.users[userKey];
}

export function selectPlayers(state, userKeys = []) {
  return userKeys.map(userKey => {
    const player = state.data.users[userKey] || {};
    return player;
  });
}

//export function getLastMessage(game) {
  //return Number(game.messages[game.messages.length - 1].timestamp);
//}

const getMessageIndex = (sortedMessages, startingMessage) => {
  const index = sortedMessages.map(message => message.key).indexOf(startingMessage);

  if (index === -1) {
    return 1;
  }

  return index + 1;
};

export function selectMessages(state, messageKeys = [], startingMessage) {
  const sortedMessages = messageKeys.map(key => ({
    ...state.data.messages[key],
    key,
  })).sort(sortBy('oldestFirst', a => a.timestamp));

  const index = getMessageIndex(sortedMessages, startingMessage);

  return sortedMessages.slice(0, index).reverse().slice(0, 1);
}

export function selectLastRead(state, gameKey) {
  return ((state.ui.Game[gameKey] || {}).seen || {}).last;
}

const getTimestampFromMessage = a => {
  return (a.messages[0] || {}).timestamp || 0;
};

const getStartingMessage = ({
  ui: {
    Games: {
      games,
    },
  },
}, gameKey) => {
  return (games[gameKey] || {}).startingMessage;
};

function noop() {}

function updateAndReduce(arr = {}, fn = noop) {
  return Object.keys(arr).reduce((obj, key) => ({
    ...obj,
    ...fn(key, arr[key]),
  }), {});
}

export function selectGames(state) {
  const games = updateAndReduce(state.data.games, (key, game) => ({
    [key]: {
      type: 'game',
      ...game,
    },
  }));

  const data = {
    ...games,
    //...invites,
  };

  const rows = Object.keys(data).map(key => {
    const row = data[key];
    const startingMessage = getStartingMessage(state, key);
    const players = selectPlayers(state, row.players);
    const messages = selectMessages(state, row.messages, startingMessage);
    const lastRead = selectLastRead(state, key);
    return {
      key,
      ...row,
      players,
      messages,
      lastRead,
    };
  });

  return rows.sort(sortBy('newestFirst', getTimestampFromMessage));
}

const getMostRecentMessage = ({ messages }) => messages[messages.length - 1];

export const selectGamesByNewestFirst = state => {
  return selectGames(state).reverse().filter(game => {
    return true;
    //return game.messages.length > 0;
  }).map(game => {
    const mostRecentMessage = getMostRecentMessage(game);

    return {
      ...game,
      isUnread: mostRecentMessage && mostRecentMessage.key !== game.lastRead,
    };
  });
};

export function selectUI(state) {
  return {
    fetching: state.ui.Games.fetching,
  };
}

export function mapStateToProps(state) {
  const loggerMessages = state.ui.Logger.messages;

  return {
    games: selectGamesByNewestFirst(state),
    me: selectMe(state),
    ui: selectUI(state),
    logger: loggerMessages,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchData: (userKey) => {
        return dispatch(fetchData(userKey));
      },
      openGame: (game, games) => {
        return dispatch(openGame(game, games));
      },
      updateStartingMessage: game => {
        return dispatch(updateStartingMessage(game));
      },
      updateDeviceToken: token => {
        dispatch(updateDeviceToken(token));
      },
      pauseGame: bindActionCreators(pauseGame, dispatch),
      leaveGame: bindActionCreators(leaveGame, dispatch),
    },
  };
}

