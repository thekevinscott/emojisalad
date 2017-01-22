import typeToReducer from 'type-to-reducer';

//import translateTimestampFromDatabase from 'app/utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
} from 'app/pages/Games/types';

import {
  RECEIVE_MESSAGE,
} from 'app/pages/Game/types';

export const initialState = {};

function translateInvite(stateInvite = {}, invite = {}) {
  return {
    key: invite.key || stateInvite.key,
    game: invite.game || stateInvite.game,
    used: invite.used || stateInvite.used,
    id: invite.id || stateInvite.id,
    invited_user: invite.invited_user || stateInvite.invitedUser,
    inviter_player: invite.inviter_player || stateInvite.inviter_player,
  };
}

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, { data }) => {
      return {
        ...data.filter(obj => {
          return obj.type === 'invite';
        }).reduce((obj, invite) => ({
          ...obj,
          [invite.key]: translateInvite(state[invite.key], invite),
        }), {}),
      };
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      console.log('handle this ****** invite reducer ', data);
      /*
      const inviteKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = state[gameKey] || {};
      return {
        ...state,
        [gameKey]: {
          ...game,
          messages,
          totalMessages: (game.totalMessages || 0) + 1,
        },
      };
      */
    },
  },
}, initialState);

