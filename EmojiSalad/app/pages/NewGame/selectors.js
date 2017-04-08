import { bindActionCreators } from 'redux'

import {
  selectMe,
} from 'components/App/selectors';

import {
  invitePhoneNumber,
  removePhoneNumber,
  startGame,
} from './actions';

export function mapStateToProps(state) {
  const invitedPlayers = Object.keys(state.ui.NewGame.invitedPlayers).map(key => {
    return state.ui.NewGame.invitedPlayers[key];
  });

  const me = selectMe(state);

  return {
    invitedPlayers,
    me,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      invitePhoneNumber: bindActionCreators(invitePhoneNumber, dispatch),
      removePhoneNumber: bindActionCreators(removePhoneNumber, dispatch),
      startGame: bindActionCreators(startGame, dispatch),
    },
  };
}

