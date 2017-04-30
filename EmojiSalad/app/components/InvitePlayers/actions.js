import ContactsWrapper from 'react-native-contacts-wrapper';

import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  INVITE_PLAYER,
  REMOVE_PLAYER,
  CLEAR_INVITES,
} from './types';

export const clearInvites = () => ({
  type: CLEAR_INVITES,
});

export const invitePlayer = () => dispatch => {
  return ContactsWrapper.getContact().then(player => {
    return dispatch({
      type: INVITE_PLAYER,
      player,
    });
  }).catch(({
    code,
    message,
  }) => {
    if (code === 'E_CONTACT_CANCELLED') {
      return null;
    }

    console.error('Error from contacts', code, message);
  });
};

export const removePlayer = player => {
  return {
    type: REMOVE_PLAYER,
    player,
  };
};
