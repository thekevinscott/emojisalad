import typeToReducer from 'type-to-reducer';
import Raven from 'raven-js';

import {
  SAVE_PUSH_ID,
} from 'core/redux/middlewares/pushNotificationMiddleware/types';

import {
  UPDATE_DEVICE_INFO,
} from 'utils/device/types';

import {
  SERVER_LOGIN,
  LOCAL_LOGOUT,
} from 'core/redux/middlewares/authenticationMiddleware/types';

import {
  UPDATE_USER,
} from 'pages/Settings/types';

const SEND_FRIENDS = `@users/SEND_FRIENDS`;

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
  registered: 0,
  contacts: {
    friends: [],
    invitableFriends: [],
  },
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
    registered: payload.registered,
    contacts: payload.contacts,
  };
};

const gatherContacts = (contacts = [], { key }) => contacts.reduce((obj, friend, order) => ({
  ...obj,
  [friend[key]]: friend,
  // facebook returns friends in an intelligent order (that it thinks you
  // will prefer) so we maintain that order
  order,
}), {});

export default typeToReducer({
  [SEND_FRIENDS]: (state, {
    data: contacts,
  }) => {
    return {
      ...state,
      contacts: {
        friends: gatherContacts(contacts.friends, { key: 'key' }),
        invitable_friends: gatherContacts(contacts.invitable_friends, { key: 'id' }),
      },
    };
  },
  [LOCAL_LOGOUT]: () => {
    return initialState;
  },
  [UPDATE_USER]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        ...translateMe(action.data),
      };
    },
  },
  [SERVER_LOGIN]: {
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
