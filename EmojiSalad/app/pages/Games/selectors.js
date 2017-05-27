import { bindActionCreators } from 'redux';
import {
  fetchData,
  openGame,
  //updatePushId,
  updateStartingMessage,
  leaveGame,
  pauseGame,
  confirmInvite,
  cancelInvite,
} from './actions';

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
  return selectGames(state).reverse().filter(() => {
    return true;
    //return game.messages.length > 0;
  }).map(game => {
    const mostRecentMessage = getMostRecentMessage(game);

    return {
      ...game,
      isUnread: true,
      //isUnread: mostRecentMessage && mostRecentMessage.key !== game.lastRead,
    };
  });
};

const selectInvites = ({ data }) => {
  return Object.keys(data.invites).map(key => {
    const invite = data.invites[key];
    const inviterUserKey = data.players[invite.inviter_player].userKey;
    const inviter = {
      key: inviterUserKey,
      ...data.users[inviterUserKey],
    };

    return {
      key: invite.key,
      game: invite.game,
      inviter,
    };
  });
};

export function mapStateToProps(state) {
  const loggerMessages = state.ui.Logger.messages;

  return {
    fetching: state.ui.Games.fetching || false,
    games: selectGamesByNewestFirst(state),
    invites: selectInvites(state),
    me: selectMe(state),
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
      pauseGame: bindActionCreators(pauseGame, dispatch),
      leaveGame: bindActionCreators(leaveGame, dispatch),
      confirmInvite: bindActionCreators(confirmInvite, dispatch),
      cancelInvite: bindActionCreators(cancelInvite, dispatch),
    },
  };
}

