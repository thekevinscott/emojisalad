import { bindActionCreators } from 'redux'

import {
  invitePhoneNumber,
  removePhoneNumber,
  clearInvites,
} from './actions';

const getInvitedPlayers = ({
  ui: {
    InvitePlayers: {
      invitedPlayers,
    },
  },
}) => Object.keys(invitedPlayers).map(key => invitedPlayers[key]);

export function mapStateToProps(state) {
  const invitedPlayers = getInvitedPlayers(state);

  return {
    invitedPlayers,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      invitePhoneNumber: bindActionCreators(invitePhoneNumber, dispatch),
      removePhoneNumber: bindActionCreators(removePhoneNumber, dispatch),
      clearInvites: bindActionCreators(clearInvites, dispatch),
    },
  };
}
