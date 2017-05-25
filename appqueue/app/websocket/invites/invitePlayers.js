import fetchFromService from '../../../utils/fetchFromService';

export default function inviteUser(inviterKey, gameKey, players = []) {
  return Promise.all(players.map(({ player }) => fetchFromService({
    service: 'api',
    route: 'invites.create',
    routeParams: {
      game_id: gameKey,
    },
    options: {
      body: {
        inviter_key: inviterKey,
        invitee: player,
      },
    },
  })));
}

