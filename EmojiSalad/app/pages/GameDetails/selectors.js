//import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  inviteToGame,
} from './actions';

export function mapStateToProps(state) {
  const me = selectMe(state);
  const pending = state.ui.NewGame.pending;

  return {
    me,
    pending,
  };
}

export function mapDispatchToProps(dispatch, { game }) {
  return {
    actions: {
      inviteToGame: (me, player) => {
        return dispatch(inviteToGame(me.key, game, player));
      },
    },
  };
}
