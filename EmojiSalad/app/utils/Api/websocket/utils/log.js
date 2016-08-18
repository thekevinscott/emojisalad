import {
  dispatch,
} from './store';

import {
  update,
} from '../../../../components/Logger/actions';

const log = (msg) => {
  dispatch(update(msg));
};

export default log;
