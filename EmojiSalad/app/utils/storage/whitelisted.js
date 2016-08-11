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
    'games',
    'users',
    'players',
    'messages',
  ],
};

export default WHITELISTED_REDUCERS;
