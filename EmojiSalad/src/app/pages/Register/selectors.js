import {
  selectMe,
} from 'app/components/App/selectors';

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
        //console.log('go to dem games');
        return goToGames();
      },
    },
  };
}

