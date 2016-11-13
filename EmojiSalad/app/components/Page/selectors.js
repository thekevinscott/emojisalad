import moment from 'moment';

import {
  API_PORT,
  API_HOST,
} from 'config';

const connectedText = lastConnected => {
  const t = moment(lastConnected);
  const time = t.format('HH:mm:ss a');
  return {
    text: `Connected at ${time}`,
    code: 0,
  };
};

function selectStatus({
  ui: {
    Games,
  },
  application: {
    connection: {
      lastConnected,
      connected,
    },
  },
}, {
  name,
}, game = {}) {
  if (name === 'register') {
    if (!connected) {
      return {
        text: `Connecting to Server at ${API_HOST}:${API_PORT}`,
        code: 1,
        loading: true,
      };
    }

    return {};
  } else if (name === 'games') {
    if (!connected) {
      return {
        text: `Connecting to Server at ${API_HOST}:${API_PORT}`,
        code: 1,
        loading: true,
      };
    } else if (Games.fetching) {
      return {
        text: 'Fetching latest games',
        code: 400,
      };
    } else if (Games.error) {
      return {
        text: 'Error fetching games',
        code: 401,
      };
    }
  } else if (name === 'game') {
    if (game.loading) {
      return {
        text: 'Fetching latest messages',
        code: 500,
      };
    } else if (game.sending) {
      return {
        text: 'Sending message',
        code: 502,
      };
    } else if (game.error) {
      return {
        text: 'Error fetching latest messages',
        code: 501,
      };
    }
  }

  return connectedText(lastConnected);
}

export function mapStateToProps(state, props) {
  return {
    status: selectStatus(state, props),
  };
}

export function mapDispatchToProps() {
  return {};
}
