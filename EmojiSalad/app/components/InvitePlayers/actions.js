import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  INVITE_PHONE,
  REMOVE_PHONE,
  CLEAR_INVITES,
} from './types';

export const clearInvites = () => ({
  type: CLEAR_INVITES,
});

export const invitePhoneNumber = phone => {
  return {
    type: INVITE_PHONE,
    phone,
  };
};

export const removePhoneNumber = player => {
  return {
    type: REMOVE_PHONE,
    player,
  };
};
