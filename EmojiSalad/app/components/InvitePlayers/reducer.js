import typeToReducer from 'type-to-reducer';
import R from 'ramda';

import {
  INVITE_PLAYER,
  REMOVE_PLAYER,
  CLEAR_INVITES,
} from './types';

const initialState = {
  invitedPlayers: {},
};

const invitedPlayer = player => {
  return {
    ...player,
    added: new Date(),
  };
};

const invitePlayer = (state, { player }) => {
  if (player.phone !== '') {
    return {
      ...state,
      invitedPlayers: {
        ...state.invitedPlayers,
        [player.phone]: invitedPlayer(player),
      },
    };
  }

  return state;
};

const removePlayer = (state, { player }) => {
  return {
    ...state,
    invitedPlayers: R.dissoc(player.phone, state.invitedPlayers),
  };
};

const clearInvites = (state) => {
  return {
    ...state,
    invitedPlayers: {},
  };
};

export default typeToReducer({
  [INVITE_PLAYER]: invitePlayer,
  [REMOVE_PLAYER]: removePlayer,
  [CLEAR_INVITES]: clearInvites,
}, initialState);
