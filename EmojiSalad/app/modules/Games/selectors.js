import {
  sortByOldestFirst,
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

export function getLastMessage(game) {
  return Number(game.messages[game.messages.length - 1].timestamp);
}

export function selectMessages(state, messageKeys) {
  return messageKeys.map(key => {
    return state.data.messages[key];
  }).sort(sortByOldestFirst);
}

export function selectGames(state) {
  const games = Object.keys(state.data.games || {}).map(gameId => {
    const game = state.data.games[gameId];
    return {
      ...game,
      players: selectPlayers(state, game.players),
      messages: selectMessages(state, game.messages),
    };
  });
  const sortedGames = games.sort((a, b) => {
    return new Date(getLastMessage(a)) - new Date(getLastMessage(b));
  });
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
