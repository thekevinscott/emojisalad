import moment from 'moment';


export function selectStatus({
  ui: {
    Games,
  },
  application: {
    connection: {
      lastConnected,
      connected,
    },
  },
}, game = {}) {
  if (!connected) {
    return {
      text: 'Connecting to Server',
      state: 1,
    };
  } else if (game.loading) {
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
  }

  const t = moment(lastConnected);
  const time = t.format('HH:mm:ss a');
  return {
    text: `Complete at ${time}`,
    state: 0,
  };
}
