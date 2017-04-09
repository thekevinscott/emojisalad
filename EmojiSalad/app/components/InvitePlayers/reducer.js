import typeToReducer from 'type-to-reducer';
import R from 'ramda';

import {
  INVITE_PHONE,
  REMOVE_PHONE,
  CLEAR_INVITES,
} from './types';

const initialState = {
  invitedPlayers: {},
};

const invitedPlayer = phone => {
  return {
    phone,
    added: new Date(),
  };
};

const invitePhone = (state, { phone }) => {
  if (phone !== '') {
    return {
      ...state,
      invitedPlayers: {
        ...state.invitedPlayers,
        [phone]: invitedPlayer(phone),
      },
    };
  }

  return state;
};

const removePhone = (state, { player }) => {
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
  [INVITE_PHONE]: invitePhone,
  [REMOVE_PHONE]: removePhone,
  [CLEAR_INVITES]: clearInvites,
}, initialState);
