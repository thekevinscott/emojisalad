export function selectUser(state, userId) {
  return state.data.users[userId];
}

export function selectPlayers(state, userKeys) {
  console.log('state data', state.data);
  return userKeys.map(userKey => {
    console.log('user key', userKey);
    const player = state.data.users[userKey] || {};
    return player;
  });
}

export function selectGames(state) {
  return Object.keys(state.data.games || {}).map(gameId => {
    const game = state.data.games[gameId];
    return {
      ...game,
      players: selectPlayers(state, game.players),
    };
  });
}

export function selectUI(state) {
  return {
    fetching: state.ui.Games.fetching,
  };
}
