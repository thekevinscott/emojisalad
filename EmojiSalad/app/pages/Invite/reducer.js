import typeToReducer from 'type-to-reducer';

import {
  FB_API,
} from 'middlewares/networkMiddleware/types';

import {
  GET_USER_FRIENDS,
} from './types';

const initialState = {
  friends: [],
  invitableFriends: [],
};

const handleGetUserFriends = (state, data) => {
  return {
    ...state,
    friends: data['me/friends'].data,
    invitableFriends: data['me/invitable_friends'].data,
  };
};

export default typeToReducer({
  [FB_API]: {
    FULFILLED: (state, {
      meta,
      data,
    }) => {
      if (meta.type === GET_USER_FRIENDS) {
        return handleGetUserFriends(state, data);
      }

      return state;
    },
  },
}, initialState);

