import typeToReducer from 'type-to-reducer';

import {
  START_NEW_GAME,
  INVITE_TO_GAME,
} from './types';

const initialState = {
  pending: false,
};
const initialGameDetails = {
  pending: false,
  pendingInvites: {},
};

export default typeToReducer({
  [START_NEW_GAME]: {
    PENDING: state => {
      return {
        ...state,
        pending: true,
      };
    },
    FULFILLED: state => {
      return {
        ...state,
        pending: false,
      };
    },
  },
  [INVITE_TO_GAME]: {
    PENDING: (state, {
      meta: {
        gameKey,
        //userKey,
        players,
      },
    }) => {
      return {
        ...state,
        [gameKey]: {
          ...initialGameDetails,
          pending: true,
          pendingInvites: players.reduce((obj = {}, player) => {
            return {
              ...obj,
              [player.id]: {
                ...player,
                status: 'pending',
              },
            };
          }, (state[gameKey] || {}).pendingInvites),
        },
      };
    },
    FULFILLED: (state, {
      meta: {
        gameKey,
        players,
      },
      //data,
    }) => {
      /*
      const foundError = data.reduce((foundError, invite) => {
        if (foundError || invite.error) {
          return true;
        }

        return false;
      }, false);

      if (foundError) {
        return state;
      }
      */

      const playerIds = players.map(player => player.id);

      const gameDetail = state[gameKey] || {};

      const pendingInvites = Object.keys(gameDetail.pendingInvites).reduce((obj, facebookId) => {
        if (playerIds.indexOf(facebookId) !== -1) {
          return obj;
        }

        return {
          ...obj,
          [facebookId]: state.pendingInvites[gameKey][facebookId],
        };
      }, {});

      return {
        ...state,
        [gameKey]: {
          ...initialGameDetails,
          pending: false,
          pendingInvites,
        },
      };
    },
  },
}, initialState);

