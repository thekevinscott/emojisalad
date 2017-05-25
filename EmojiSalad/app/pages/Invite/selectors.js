import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  //invite,
  getUserFriends,
} from './actions';

export function mapStateToProps(state) {
  const me = selectMe(state);
  //const gameKey = game.key;

  return {
    me,
    friends: state.ui.Invite.friends,
    invitableFriends: state.ui.Invite.invitableFriends,
    //gameKey,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      //invite: bindActionCreators(invite, dispatch),
      getUserFriends: bindActionCreators(getUserFriends, dispatch),
    },
  };
}

