import typeToReducer from 'type-to-reducer';

import {
  UPDATE_DEVICE_TOKEN,
} from '../utils/pushNotificationListeners/types';

import {
  UPDATE_DEVICE_INFO,
} from '../utils/device/types';

import {
  types,
} from '../modules/Register';
const {
  SUBMIT_CLAIM,
} = types;

const initialState = {
  //id: null,
  key: null,
  blacklist: null,
  from: null,
  nickname: null,
  avatar: null,
  maximum_games: null,
  last_activity: null,
  created: null,
  archived: null,
  confirmed: null,
  confirmed_avatar: null,
  protocol: null,
  deviceToken: null,
  deviceInfo: null,
};

const translateMe = (payload) => {
  return {
    //id: payload.id,
    key: payload.key,
    blacklist: payload.blacklist,
    from: payload.from,
    nickname: payload.nickname,
    avatar: payload.avatar,
    maximum_games: payload.maximum_games,
    last_activity: payload.last_activity,
    created: payload.created,
    archived: payload.archived,
    confirmed: payload.confirmed,
    confirmed_avatar: payload.confirmed_avatar,
    protocol: payload.protocol,
  };
};

export default typeToReducer({
  [SUBMIT_CLAIM]: {
    FULFILLED: (state, action) => ({
      ...state,
      ...translateMe(action.data),
    }),
  },
  [UPDATE_DEVICE_TOKEN]: (state, { deviceToken }) => ({
    ...state,
    deviceToken,
  }),
  [UPDATE_DEVICE_INFO]: (state, { info }) => ({
    ...state,
    deviceInfo: info,
  }),

}, initialState);
