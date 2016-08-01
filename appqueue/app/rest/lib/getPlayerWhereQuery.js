export default function getPlayerWhereQuery(players, isSent) {
  return players.split(',').map((player) => {
    return player.split(':');
  }).map((player) => {
    if (isSent) {
      return {
        from: player[0],
        to: player[1],
      };
    }

    return {
      to: player[0],
      from: player[0],
    };
  }).map((player) => {
    return `(\`to\` = '${player.to}' AND \`from\` = '${player.from}')`;
  }).join(' OR ');
}
