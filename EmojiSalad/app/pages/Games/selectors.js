import {
  fetchData,
  openGame,
  updateStartingMessage,
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

export function selectMessages(state, messageKeys, startingMessage) {
  const sortedMessages = messageKeys.map(key => ({
    ...state.data.messages[key],
    key,
  })).sort(sortBy('oldestFirst', a => a.timestamp));

  const index = sortedMessages.map(message => message.key).indexOf(startingMessage) + 1;

  return sortedMessages.slice(0, index !== -1 ? index : null).reverse();
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

export function selectGames(state) {
  const invites = Object.keys(state.data.invites || {}).reduce((obj, inviteKey) => {
    const invite = state.data.invites[inviteKey];
    return {
      ...obj,
      [invite.game.key]: {
        type: 'invite',
        ...invite.game,
        invite,
      },
    };
  }, {});

  const data = {
    ...state.data.games,
    ...invites,
  };

  console.log(data);

  const rows = Object.keys(data).map(gameKey => {
    const game = state.data.games[gameKey];
    const startingMessage = getStartingMessage(state, gameKey);
    console.log('row', game, startingMessage);
    return {
      ...game,
      players: selectPlayers(state, game.players),
      messages: selectMessages(state, game.messages, startingMessage),
      lastRead: selectLastRead(state, gameKey),
    };
  });

  return rows.sort(sortBy('newestFirst', getTimestampFromMessage));
}

export function selectGamesByNewestFirst(state) {
  return selectGames(state).reverse();
}

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
    },
  };
}

