import fetchFromService from '../../../utils/fetchFromService';

export default function getUserGames(userKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }

  const promises = [
    fetchFromService({
      service: 'api',
      route: 'games.get',
      options: {
        body: {
          user_key: userKey,
        },
      },
    }),
    fetchFromService({
      service: 'api',
      route: 'invites.get',
      options: {
        body: {
          invited_from_key: userKey,
        },
      },
    }),
  ];
  return Promise.all(promises).then(response => {
    console.info('response back from promises', response);
    const games = response[0];
    const invites = response[1];
    console.info(games, invites);
    return games.concat(invites);
  });
}
