import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  invite,
} from './actions';

export function mapStateToProps(state, { game }) {
  const me = selectMe(state);
  const gameKey = game.key;

  return {
    me,
    gameKey,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      invite: bindActionCreators(invite, dispatch),
    },
  };
}

