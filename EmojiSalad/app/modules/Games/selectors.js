export function selectUser(state, userId) {
  return state.users[userId];
}

export function selectPlayers(state, playerIds) {
  return playerIds.map(playerId => {
    const player = state.players[playerId] || {};
    //console.log(playerId, state, player);
    return {
      ...player,
      ...selectUser(state, player.user_id),
    };
  });
}

export function selectGames(state) {
  return Object.keys(state.games || {}).map(gameId => {
    const game = state.games[gameId];
    return {
      ...game,
      players: selectPlayers(state, game.players),
    };
  });
}
