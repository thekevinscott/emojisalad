import typeToReducer from 'type-to-reducer';

//import translateTimestampFromDatabase from 'app/utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
  CONFIRM_INVITE,
  CANCEL_INVITE,
} from 'app/pages/Games/types';

//import {
  //RECEIVE_MESSAGE,
//} from 'app/pages/Game/types';

export const initialState = {};

const initialInvite = {
  invited_user: {},
  inviter_player: {},
  game: {},
};

function translateInvite(stateInvite = initialInvite, invite = initialInvite) {
  return {
    key: invite.key || stateInvite.key,
    game: invite.game.key || stateInvite.game.key,
    used: invite.used || stateInvite.used,
    //id: invite.id || stateInvite.id,
    invited_user: invite.invited_user.key || stateInvite.invitedUser.key,
    inviter_player: invite.inviter_player.key || stateInvite.inviter_player.key,
  };
}

const omitKey = (state, { meta }) => {
  return Object.keys(state).reduce((obj, key) => {
    if (key === meta.invite.key) {
      return obj;
    }

    return {
      ...obj,
      [key]: state[key],
    };
  }, {});
};

export default typeToReducer({
  [CONFIRM_INVITE]: {
    FULFILLED: omitKey,
  },
  [CANCEL_INVITE]: {
    FULFILLED: omitKey,
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, { data }) => {
      return {
        ...state,
        ...data.filter(obj => {
          return obj.type === 'invite';
        }).reduce((obj, invite) => ({
          ...obj,
          [invite.key]: translateInvite(state[invite.key], invite),
        }), {}),
      };
    },
  },
  //[RECEIVE_MESSAGE]: {
    //FULFILLED: (state, { data }) => {
      //console.log('handle this ****** invite reducer ', data);
      //if (data.messageKey === 'invite') {
        //const key = 'unknown';
        //return {
          //...state,
          //[key]: translateInvite(state[key], data),
        //};
      //}

      //return state;
    //},
  //},
}, initialState);
