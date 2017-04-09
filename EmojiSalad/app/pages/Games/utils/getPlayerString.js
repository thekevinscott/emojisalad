const getPlayerString = players => {
  console.log('******** need to fix this: players', players);
  const playerString = players.map(player => `${player.nickname}`).join(', ');

  const characterLimit = 30;

  if (playerString.length > characterLimit) {
    return `${playerString.substring(0, characterLimit - 3)}...`;
  }
  return playerString;
};

export default getPlayerString;
