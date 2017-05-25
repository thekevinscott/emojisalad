import { Actions } from 'react-native-router-flux';

import {
  updateUser,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    me: state.data.me,
    saved: state.ui.Onboarding.saved,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    next: () => {
      Actions.games();
    },
    updateUser: (form, me) => {
      return dispatch(updateUser(form, me));
    },
  };
};
