//import { Actions } from 'react-native-router-flux';

import {
  updateSettings,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    me: state.data.me,
    pending: state.ui.Settings.pending,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      updateSettings: (form, me) => {
        return dispatch(updateSettings(form, me));
      },
    },
  };
};
