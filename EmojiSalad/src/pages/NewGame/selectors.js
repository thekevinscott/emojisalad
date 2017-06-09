import { bindActionCreators } from 'redux'

import {
  startGame,
} from './actions';

export function mapStateToProps(state) {
  const me = state.data.me;
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
