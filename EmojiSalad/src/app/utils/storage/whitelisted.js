const WHITELISTED_REDUCERS = {
  ui: [
    'App',
    {
      key: 'Game',
      slice: state => {
        return Object.keys(state).reduce((obj, gameKey) => {
          const game = state[gameKey];
          return {
            ...obj,
            [gameKey]: {
              updated: game.updated,
              seen: {
                last: (game.seen || {}).last,
              },
            },
          };
        }, {});
      },
    },
    {
      key: 'Games',
      slice: state => {
        return {
          games: Object.keys(state.games).reduce((obj, gameKey) => ({
            ...obj,
            [gameKey]: {
              startingMessage: (state.games[gameKey] || {}).startingMessage,
            },
          }), {}),
        };
      },
    },
  ],
  data: [
    'me',
    {
      key: 'games',
      slice: state => {
        return Object.keys(state).reduce((obj, gameKey) => {
          const {
            key,
            roundCount,
            players,
            round,
            messages,
            totalMessages,
          } = state[gameKey];

          return {
            ...obj,
            [gameKey]: {
              key,
              roundCount,
              players,
              round,
              messages,
              totalMessages,
            },
          };
        }, {});
      },
    },
    'users',
    'players',
    'messages',
  ],
};

export default WHITELISTED_REDUCERS;
