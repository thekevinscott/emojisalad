import fetchFromService from '../../../utils/fetchFromService';

export default function invitePlayers(inviterKey, gameKey, players = []) {
  return Promise.all(players.map(player => {
    console.info('the player to invite', player);
    return fetchFromService({
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
    });
  }));
}

