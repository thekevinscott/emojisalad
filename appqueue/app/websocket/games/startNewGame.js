import fetchFromService from '../../../utils/fetchFromService';

export default function startNewGame(key) {
  if (!key) {
    throw new Error('You must provide a user key');
  }

  return fetchFromService({
    service: 'api',
    route: 'games.create',
    options: {
      body: {
        users: [
          {
            key,
          },
        ],
      },
    },
  }).then((game) => {
    console.log('PING THE BOT', game);
    return fetchFromService({
      service: 'bot',
      route: 'newGame',
      options: {
        body: game,
      },
    }).then(() => {
      return game;
    }).catch(err => {
      console.log('Bot is down', err);
    });
  });
}
