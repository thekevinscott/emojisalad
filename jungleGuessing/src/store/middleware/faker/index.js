import faker from 'faker';

import {
  RECEIVED_MESSAGE,
} from '../websocket/types';

const NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_GUESSES = 100;

const getPlayer = () => {
  const number = faker.phone.phoneNumberFormat();
  return {
    number,
  };
};

const getPlayers = () => {
  const num = NUMBER_OF_PLAYERS;
  return Array(num).fill({}).map(() => {
    return getPlayer();
  });
};

const getMessage = () => {
  const correct = Math.floor(Math.random() * 20);
  if (correct === 0) {
    return 'Super Mario Bros';
  } else if (correct === 1) {
    return 'Alice in Wonderland';
  }
  const rand = Math.ceil(Math.pow(Math.random() * 2.2, 2));
  return faker.random.words(rand);
};

const setDispatch = dispatch => {
  getPlayers().forEach(player => {
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
      setTimeout(() => {
        dispatch({
          type: RECEIVED_MESSAGE,
          data: {
            number: player.number,
            message: getMessage(),
            created: new Date(),
          },
        });
      }, 1000 + Math.floor(Math.random() * 1000 * 10) + (i * 2000 * NUMBER_OF_PLAYERS / 5));
    }
  });
};

export default function websocketMiddleware({
  dispatch,
}) {
  setDispatch(dispatch);
  return next => action => {
    return next(action);
  };
}
