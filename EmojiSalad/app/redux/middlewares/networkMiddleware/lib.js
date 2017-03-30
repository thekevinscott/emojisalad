import {
  SUBMIT_CLAIM,
} from 'pages/Register/types';

export const REST = 'rest';
export const WEBSOCKET = 'websocket';

const lib = {
  [SUBMIT_CLAIM]: WEBSOCKET,
};

export default lib;
