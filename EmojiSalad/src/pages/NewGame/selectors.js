import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  startGame,
} from './actions';

export function mapStateToProps(state) {
  const me = selectMe(state);
  const pending = state.ui.NewGame.pending;

  return {
    me,
    pending,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      startGame: bindActionCreators(startGame, dispatch),
    },
  };
}
