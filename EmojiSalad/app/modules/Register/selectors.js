import {
  selectStatus,
} from '../../utils/Api/websocket/selectors';

import {
  selectMe,
} from '../App/selectors';

import {
  submitClaim,
  updateText,
  updateError,
  goToGames,
} from './actions';

export function selectRegisterSlice({ ui }) {
  const {
    text,
    claiming,
    error,
    migration,
  } = ui.Register;

  return {
    text,
    claiming,
    error,
    migration,
  };
}

export function mapStateToProps(state) {
  return {
    ...selectRegisterSlice(state),
    me: selectMe(state),
    //logger: state.ui.Games.logger,
    status: selectStatus(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateError: (error) => {
        return dispatch(updateError(error));
      },
      updateText: (text) => {
        return dispatch(updateText(text));
      },
      submitClaim: (text) => {
        return dispatch(submitClaim(text));
      },
      goToGames: () => {
        return goToGames();
      },
    },
  };
}

