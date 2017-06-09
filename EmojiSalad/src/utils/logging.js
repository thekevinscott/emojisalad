import Raven from 'raven-js';
import { INFO } from 'utils/device/index';
require('raven-js/plugins/react-native')(Raven);

import {
  RAVEN_URL,
} from 'src/config';

Raven.config(RAVEN_URL, {
  release: INFO.readableAppVersion,
}).install();

const raven = {
  setUser: (user) => {
    Raven.setUser({
      key: user.key,
      nickname: user.nickname,
    });
  },
};

export default raven;
