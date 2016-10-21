import moment from 'moment';

const getAttemptString = attempts => {
  if (attempts === 1) {
    return '1 attempt';
  }

  return `${attempts} attempts`;
};

export function selectStatus({
  ui: {
    Games,
  },
  router: {
    websocket: {
      attempts,
      connected,
    },
  },
}, game = {}) {
  if (game.loading) {
    return {
      text: 'Fetching latest messages',
      state: 500,
    };
  } else if (game.sending) {
    return {
      text: 'Sending message',
      state: 502,
    };
  } else if (game.error) {
    return {
      text: 'Error fetching latest messages',
      state: 501,
    };
  } else if (Games.fetching) {
    return {
      text: 'Fetching latest games',
      state: 400,
    };
  } else if (Games.error) {
    return {
      text: 'Error fetching games',
      state: 401,
    };
  } else if (!connected) {
    return {
      text: `Connecting to Server: ${getAttemptString(attempts)}`,
      state: 1,
    };
  }

  const t = moment(connected);
  const time = t.format('HH:mm:ss a');
  return {
    text: `Complete at ${time}`,
    state: 0,
  };
}
