const WHITELISTED_REDUCERS = {
  ui: [
    'App',
    {
      key: 'Game',
      slice: state => {
        return Object.keys(state).reduce((obj, gameKey) => {
          return {
            ...obj,
            [gameKey]: {
              seen: {
                last: (state[gameKey].seen || {}).last,
              },
            },
          };
        }, {});
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
