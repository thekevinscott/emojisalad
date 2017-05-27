import sendUserInviteMessage from '../../invites/sendUserInviteMessage';

export default function inviteToGame(ws, { userKey, gameKey, players }) {
  return Promise.all(players.map(player => {
    return sendUserInviteMessage(userKey, gameKey, player);
  }));
}
