import {
  dispatch,
} from './store';

const log = (msg) => {
  dispatch({
    type: 'UPDATE_LOGGER',
    logger: msg,
  });
};

export default log;
