export function selectUser(state, userId) {
  return state.data.users[userId];
}

export function selectPlayers(state, playerIds) {
  return playerIds.map(playerId => {
    const player = state.data.players[playerId] || {};
    //console.log(playerId, state, player);
    return {
      ...player,
      ...selectUser(state, player.user_id),
    };
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
