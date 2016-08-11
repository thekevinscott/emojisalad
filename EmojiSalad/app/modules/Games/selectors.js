import {
  sortBy,
} from '../../utils/sort';

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

export function selectMessages(state, messageKeys) {
  return messageKeys.map(key => ({
    ...state.data.messages[key],
    key,
  })).sort(sortBy('oldestFirst', a => a.timestamp));
}

export function selectLastRead(state, gameKey) {
  return ((state.ui.Game[gameKey] || {}).seen || {}).last;
}

export function selectGames(state) {
  const games = Object.keys(state.data.games || {}).map(gameKey => {
    const game = state.data.games[gameKey];
    return {
      ...game,
      players: selectPlayers(state, game.players),
      messages: selectMessages(state, game.messages),
      lastRead: selectLastRead(state, gameKey),
    };
  });

  const sortedGames = games.sort(sortBy('newestFirst', a => (a.messages[0] || {}).timestamp || 0));
  return sortedGames;
}

export function selectGamesByNewestFirst(state) {
  return selectGames(state).reverse();
}

export function selectUI(state) {
  return {
    fetching: state.ui.Games.fetching,
  };
}
