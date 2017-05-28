import updateGame from '../../games/updateGame';

export default function update(ws, { gameKey, params }) {
  return updateGame(gameKey, params);
};
