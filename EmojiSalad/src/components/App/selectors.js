export function selectMe({ data }) {
  return data.me;
}

export function selectGames({ data }) {
  return Object.keys(data.games).map(gameKey => {
    return data.games[gameKey];
  });
}
