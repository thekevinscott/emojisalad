import typeToReducer from 'type-to-reducer';
import Raven from 'raven-js';

import {
  SAVE_PUSH_ID,
} from 'app/components/App/types';

import {
  UPDATE_DEVICE_INFO,
} from 'app/utils/device/types';

import {
  types,
} from 'app/pages/Register';

import {
  LOGIN,
} from 'app/pages/Login/types';

import {
  UPDATE_USER,
} from 'app/pages/Settings/types';

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
    facebookId: payload.facebookId,
    facebookToken: payload.facebookToken,
  };
};

export default typeToReducer({
  [UPDATE_USER]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        ...translateMe(action.data),
      };
    },
  },
  [LOGIN]: {
    FULFILLED: (state, action) => {
      Raven.setUser({
        key: action.key,
        nickname: action.nickname,
      });

      return {
        ...state,
        ...translateMe(action.data),
      };
    },
  },
  [SUBMIT_CLAIM]: {
    FULFILLED: (state, action) => {
      Raven.setUser({
        key: action.key,
        nickname: action.nickname,
      });

      return {
        ...state,
        ...translateMe(action.data),
      };
    },
  },
  [SAVE_PUSH_ID]: (state, { pushId, pushToken }) => ({
    ...state,
    pushData: {
      pushToken,
      pushId,
    },
  }),
  [UPDATE_DEVICE_INFO]: (state, { info }) => ({
    ...state,
    deviceInfo: info,
  }),
}, initialState);
