export function selectMyPlayer(state, gameId) {
  const me = state.data.me;
  const game = state.data.games[gameId];
  const players = game.players.map(playerId => {
    return state.data.players[playerId];
  });
  const player = players.filter(gamePlayer => gamePlayer.user_id === me.id)[0];
  return state.data.players[player.id];
}

export function getMessagesByTo(messages, playerId, idKey) {
  return Object.keys(messages).map(messageId => {
    const message = messages[messageId];
    if (parseInt(message[idKey], 10) === playerId) {
      return message;
    }
    return null;
  }).filter(el => el);
}

export function selectMessages(state, gameId) {
  const player = selectMyPlayer(state, gameId);

  return [
    ...getMessagesByTo(state.data.messages.received, player.to, 'to'),
    ...getMessagesByTo(state.data.messages.sent, player.to, 'from'),
  ].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  //}).slice(0, 10);
}
