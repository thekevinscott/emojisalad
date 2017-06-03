import invitePlayers from '../../invites/invitePlayers';
import getPlayer from '../../users/getPlayer';

export default function inviteToGame(ws, { userKey, gameKey, players }) {
  // first we need to translate from user key to player key
  return getPlayer(userKey, gameKey).then(matchingPlayers => {
    if (matchingPlayers && matchingPlayers.length === 1) {
      const player = matchingPlayers[0];
      console.log('the player', player);
      return invitePlayers(player.key, gameKey, players);
    }

    console.error('matching players payload is bad', matchingPlayers);
    throw new Error('weird players returned');
  });
}
