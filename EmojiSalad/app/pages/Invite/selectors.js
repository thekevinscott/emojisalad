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
  const {
    friends,
    invitableFriends,
    fetching,
  } = state.ui.Invite;

  return {
    me,
    friends,
    invitableFriends,
    fetching,
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

